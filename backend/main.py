from db.database import Database
import webview
from api.api import API

DB_NAME = 'azuregenerator.sqlite'
DB_PATH = f'backend/assets/{DB_NAME}'

if __name__ == '__main__':
    db: Database = Database(DB_PATH)
    api: API = API(db=db)

    title: str = 'TEMPORARY'
    url: str = 'http://192.168.1.154:5173/'

    webview.create_window(title, url, js_api=api)
    webview.start(debug=True)