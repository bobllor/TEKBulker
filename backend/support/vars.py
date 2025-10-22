from pathlib import Path
from .types import HeaderMap, OpcoMap, TemplateMap, SettingsMap, AzureHeaders
from typing import Literal

AZURE_VERSION: Literal['version:v1.0'] = 'version:v1.0'
# i dont think order matters for the end csv- it may need testing.
AZURE_HEADERS: tuple[str] = (
    'Name [displayName] Required',
    'User name [userPrincipalName] Required',
    'Initial password [passwordProfile] Required',
    'Block sign in (Yes/No) [accountEnabled] Required',
    'First name [givenName]', 
    'Last name [surname]',
)

# FIXME: remove this later, this is used in testing and will replace the headers above.
AZURE_HEADERST: AzureHeaders = {
    'name': 'Name [displayName] Required',
    'username': 'User name [userPrincipalName] Required',
    'password': 'Initial password [passwordProfile] Required',
    'block_sign_in': 'Block sign in (Yes/No) [accountEnabled] Required',
    'first_name': 'First name [givenName]', 
    'last_name': 'Last name [surname]',
}

DEFAULT_HEADER_MAP: HeaderMap = {
    'opco': 'operating company',
    'name': 'full name',
}

# no @ is used here because it is added in to the username generator
DEFAULT_OPCO_MAP: OpcoMap = {
    'default': 'placeholder.com',
}
DEFAULT_SETTINGS_MAP: SettingsMap = {
    'output_dir': str(Path().home()),
}

# data for the email template, part of MAPPING table.
DEFAULT_TEMPLATE_MAP: TemplateMap = {
    'text_template': '',
    'key_words': '',
    'words_to_replace': ''
}