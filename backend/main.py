from core.json_reader import Reader
from api.api import API
from logger import Log
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, DEFAULT_SETTINGS_MAP
import webview

EXCEL_FILE: str = 'EXCEL-mapping.json'
SETTINGS_FILE: str = 'settings.json'
OPCO_FILE: str = "opco-mapping.json"
EXCEL_PATH: str = f'config/{EXCEL_FILE}'
SETTINGS_PATH: str = f'config/{SETTINGS_FILE}'
OPCO_PATH: str = f"config/{OPCO_FILE}"

if __name__ == '__main__':
    logger: Log = Log()

    excel_reader: Reader = Reader(EXCEL_FILE, defaults=DEFAULT_HEADER_MAP, logger=logger)
    settings_reader: Reader = Reader(SETTINGS_PATH, defaults=DEFAULT_SETTINGS_MAP, logger=logger)
    opco_reader: Reader = Reader(OPCO_PATH, defaults=DEFAULT_OPCO_MAP, logger=logger)

    api: API = API(
        settings_reader=settings_reader, 
        excel_reader=excel_reader,
        opco_reader=opco_reader,
        logger=logger
    )
    size: tuple[int, int] = (1280, 720)

    title: str = 'TEMPORARY'
    url: str = 'http://localhost:5173/'

    webview.create_window(title, url, js_api=api, min_size=size)
    webview.start(debug=True)