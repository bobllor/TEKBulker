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

# the types defined here are the only types allowed in my program (front end enforces it).
types: dict[type, str] = {
    str: 'TEXT',
    bool: 'NUMBER' # has to be converted to and from 0/1
}