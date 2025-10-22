from typing import Literal, Callable

class NameFormatter:
    '''Methods inheritance.'''
    def __init__(self, replace_char: str, case_: Literal["upper", "lower", "title"]):
        self.replace_char: str = replace_char
        self.method: Callable[[str], str] = None

        match case_:
            case "upper":
                self.method = str.upper
            case "lower":
                self.method = str.lower
            case "title":
                self.method = str.title
    
    def replace(self, name: str) -> str:
        '''Default option.'''
        name = self.method(name)
        return name.replace(" ", self.replace_char)
    
    def f_last(self, name: str) -> str:
        '''Formats the name to follow the format "F (Middle) Last".'''
        name = self.method(name)

        names: list[str] = self._get_name_split(name)
        name = f"{names[0][0]} {' '.join(names[1:])}"

        return name.replace(" ", self.replace_char)
    
    def first_l(self, name: str) -> str:
        '''Formats the name to follow the format "First (Middle) L"'''
        name = self.method(name)

        names: list[str] = self._get_name_split(name)
        name = f"{' '.join(names[0:-1])} {names[-1][0]}"

        return name.replace(" ", self.replace_char)
    
    def _get_name_split(self, name: str) -> list[str]:
        return name.split()

class Period(NameFormatter):
    def __init__(self, case_: Literal["upper", "lower", "title"] = "title"):
        replace_char: str = "."

        super().__init__(replace_char, case_)

class NoSpace(NameFormatter):
    def __init__(self, case_: Literal["upper", "lower", "title"] = "title"):
        replace_char: str = ""

        super().__init__(replace_char, case_)