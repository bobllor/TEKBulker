from db.database import Database
import webview
from api.api import API

DB_NAME = 'azuregenerator.sqlite'
DB_PATH = f'backend/assets/{DB_NAME}'

if __name__ == '__main__':
    db: Database = Database(DB_PATH)
    api: API = API(db=db)
    size: tuple[int, int] = (1280, 720)

    title: str = 'TEMPORARY'
    url: str = 'http://localhost:5173/'

    webview.create_window(title, url, js_api=api, min_size=size)
    webview.start(debug=True)