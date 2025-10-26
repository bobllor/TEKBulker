from pathlib import Path
from .types import HeaderMap, OpcoMap, TemplateMap, SettingsMap, AzureHeaders
from typing import Literal

# NOTE: these are default mappings used to initialize the data.
# the data is based off of ServiceNow naming, but the values can be changed.

AZURE_VERSION: Literal['version:v1.0'] = 'version:v1.0'
# i dont think order matters for the end csv- it may need testing.
AZURE_HEADERS: AzureHeaders = {
    'name': 'Name [displayName] Required',
    'username': 'User name [userPrincipalName] Required',
    'password': 'Initial password [passwordProfile] Required',
    'block_sign_in': 'Block sign in (Yes/No) [accountEnabled] Required',
    'first_name': 'First name [givenName]', 
    'last_name': 'Last name [surname]',
}

# NOTE: value is the column name in the excel/csv file.
# this dict gets reversed when it gets validated in Parser.
DEFAULT_HEADER_MAP: HeaderMap = {
    'opco': 'operating company',
    'name': 'full name',
    'country': 'country/territory',
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