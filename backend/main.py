from db.database import Database
from api.api import API
from logger import Log
import webview

DB_NAME = 'azuregenerator.sqlite'
DB_PATH = f'backend/assets/{DB_NAME}'

if __name__ == '__main__':
    logger: Log = Log()

    db: Database = Database(DB_PATH, logger=logger)
    api: API = API(db, logger=logger)
    size: tuple[int, int] = (1280, 720)

    title: str = 'TEMPORARY'
    url: str = 'http://localhost:5173/'

    webview.create_window(title, url, js_api=api, min_size=size)
    webview.start(debug=True)