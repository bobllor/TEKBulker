from pathlib import Path

AZURE_VERSION: str = 'version:v1.0'

# i dont think order matters for the end csv- it may need testing.
AZURE_HEADERS: tuple[str] = (
    'Name [displayName] Required',
    'User name [userPrincipalName] Required',
    'Initial password [passwordProfile] Required',
    'Block sign in (Yes/No) [accountEnabled] Required',
    'First name [givenName]', 
    'Last name [surname]',
    'Usage location [usageLocation]'
)

DEFAULT_HEADER_MAP: dict[str, str] = {
    'opco': 'operating company',
    'name': 'full name',
    'country': 'country/territory',
}

# no @ is used here because it is added in to the username generator
DEFAULT_OPCO_MAP: dict[str, str] = {
    'default': 'placeholder.com',
}

DEFAULT_SETTINGS_MAP: dict[str, str] = {
    'output_dir': str(Path().home() / 'Downloads'),
}

# data for the email template, part of MAPPING table.
DEFAULT_TEMPLATE_MAP: dict[str, str] = {
    'text_template': '',
    'key_words': '',
    'words_to_replace': ''
}