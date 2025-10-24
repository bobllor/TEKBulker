from core.json_reader import Reader
from api.api import API
from logger import Log
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_SETTINGS_MAP
import webview

MAP_FILE: str = 'data-mapping.json'
SETTINGS_FILE: str = 'settings.json'
MAP_PATH: str = f'config/{MAP_FILE}'
SETTINGS_PATH: str = f'config/{SETTINGS_FILE}'

if __name__ == '__main__':
    logger: Log = Log()

    mapping_reader: Reader = Reader(MAP_FILE, defaults=DEFAULT_HEADER_MAP, logger=logger)
    settings_reader: Reader = Reader(SETTINGS_PATH, defaults=DEFAULT_SETTINGS_MAP, logger=logger)
    api: API = API(settings_reader=settings_reader, mapping_reader=mapping_reader, logger=logger)
    size: tuple[int, int] = (1280, 720)

    title: str = 'TEMPORARY'
    url: str = 'http://localhost:5173/'

    webview.create_window(title, url, js_api=api, min_size=size)
    webview.start(debug=True)