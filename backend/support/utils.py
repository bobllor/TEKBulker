import string, re
from typing import Literal, Any, Callable

def validate_name(name: str) -> str:
    '''Validates a name to only the first and last name.'''
    special_chars: set[str] = set(string.punctuation)
    
    chars: list[str] = []
    for c in name:
        if c not in special_chars and not c.isdigit():
            chars.append(c)
        
        if c == '-':
            chars.append(' ')

    name: str = ''.join(chars)
    name_list: list[str] = name.split()

    unwanted_words: set[str] = {'jr', 'sr', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'the', 'of'}

    new_name: list[str] = []

    for name in name_list:
        name = name.lower().strip()
        
        is_valid: bool = re.match('^([A-Za-z]*)$', name) != None
        has_bad_words: bool = name in unwanted_words

        if is_valid and not has_bad_words and len(name) > 1:
            new_name.append(name.title())

    if not new_name:
        raise ValueError('An invalid name was entered.')

    f_name: str = new_name[0]
    l_name: str = new_name[-1]

    # if the full name is 20 characters long, then only use the first letter of the first name.
    # i don't think this is necessary, i am unsure of the limit for azure. ServiceNow had this however.
    if len(f'{f_name} {l_name}') > 20:
        return f'{f_name[0]} {l_name}'

    return f'{f_name} {l_name}'

def generate_response(*, status: Literal['error', 'success'] = 'error',
    message: str = '', values: list[list[str, Any] | tuple[str, Any]] = []) -> dict[str, Any]:
    '''Generate a dictionary with a response.
    
    Parameters
    ----------
        status: str, default *error*
            The status of the response. It can only be two string values, "success" or "error".

        message: str, default *''*
            The message of a response.

        values: list[list[str, Any] | tuple[str, Any]], default []
            A list or tuple containing a key-value pair. This is added into the dictionary.
    '''
    res: dict[str, Any] = {'status': status, 'message': message}

    for key, value in values:
        res[key] = value

    return res

def generate_username(
        username: str,
        *, 
        func: Callable[[str], str] = None,
        opco: str = None,
        opco_map: dict[str, str]) -> str:
    '''Generates the username for Azure.
    
    Parameters
    ----------
        username: str
            The username for the account to be formatted.

        func: Callable[[str], str]
            A function that takes a string and returns a string, used to format the username.
        
        opco: str, default None
            The operating company of the user, which determines the domain being used. If None is passed,
            the default key is used defined in the opco_map dictionary.
        
        opco_map: dict[str, str]
            A dictionary used to get the domain based on the operating company.
    '''
    if func:
        username: str = func(username)
    
    # default is user defined
    default_opco: str = opco_map.get('default', 'NOTFOUND.COM')
    
    return f'{username}@{opco_map.get(opco, default_opco)}'

def get_date(date_format: str = '%Y-%m-%d-%H%M%S') -> str:
    '''Get the date, by default it returns the format YY-MM-DD-HHMMSS'''
    from datetime import datetime

    date: str = datetime.today().strftime(date_format)

    return date

def generate_name(name: str) -> tuple[str]:
    '''Generate the names for the user.'''
    f_name, l_name = name.split()

    return f_name, l_name

def generate_password(max_length: int = 20) -> str:
    '''Random password generation.'''
    # FIXME: add a profanity checker?
    import random, string

    pw: list[str] = []

    upper: string = string.ascii_uppercase
    lower: string = string.ascii_lowercase

    # ' - % $ are not allowed
    punctuations: string = ''.join([c for c in string.punctuation if c not in '-%\'$'])

    valid_chars: string = upper + lower + punctuations

    # need at least one upper, lower, and special
    for seq in [upper, lower, punctuations]:
        pw.append(random.choice(seq))

    new_length: int = max_length - 3

    for _ in range(new_length):
        pw.append(random.choice(valid_chars))
    
    random.shuffle(pw)
    
    return "".join(pw)

def generate_text_template(*, 
    text: str, 
    username: str = '', 
    password: str = '',
    name: str = '') -> dict[str, str]:
    '''Replaces strings in a text template for onboarding.

    There are key words that can be replaced: USERNAME, PASSWORD, and NAME. \n
    In order to replace them, the exact variable ***must be enclosed by brackets***. \n
    The key words are ***case sensitive***, the function expects it to be uppercase.
    Example:
    ```python
    password, name = password1234, John Doe
    text = "Hello [NAME], your password is [PASSWORD] and your username is [USERNAME]."
    # replacement code here...
    print(text) # "Hello John Doe, your password is password1234 and your username is [USERNAME]."
    ```
    
    This will replace **all** occurrences of the brackets. \n
    If no values are passed in the variables, then no replacements will occur to that key word in the text.

    Parameters
    ----------
        text: str
            The text used that is being replaced, it has a max length of 500. The words being replaced
            **must be surrounded by brackets**, e.g. [NAME].
        
        username: str, default ''
            The username of the client.
        
        password: str, default ''
            The password of the client. This is stored as **plain text**, and it is best practice to enable
            “User must change password at next logon”  on Azure.
        
        name: str, default ''
            Name of the client.
    '''
    max_chars: int = 500

    # this is going to get checked on the front end but it won't hurt to have this just in case.
    if len(text) > max_chars:
        return generate_response(status='error', message='Cannot have a text of over 500 characters.')

    key_words: list[str] = ['USERNAME', 'PASSWORD', 'NAME']
    data: list[str] = [username, password, name]

    for i in range(len(key_words)):
        # this will not ever be empty, i don't know why i did this.
        if data[i] == '':
            continue
    
        replace_word: str = data[i].title() if key_words[i] == 'NAME' else data[i]
        text = text.replace(f'[{key_words[i]}]', replace_word)
    
    return generate_response(status='success', 
        message='Successfully generated the text in the output folder.',
        values=[['text', text]])