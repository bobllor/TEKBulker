from typing import TypedDict

class GenerateCSVProps(TypedDict):
    fileName: str
    b64: str

class ManualCSVProps(TypedDict):
    name: str
    opco: str
    id: str

class AzureHeaders(TypedDict):
    name: str
    username: str
    password: str
    block_sign_in: str
    first_name: str
    last_name: str

class SettingsMap(TypedDict):
    output_dir: str

class HeaderMap(TypedDict):
    opco: str
    name: str

class OpcoMap(TypedDict):
    default: str

class TemplateMap(TypedDict):
    text_template: str
    key_words: str
    words_to_replace: str