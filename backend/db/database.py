import sqlite3
from typing import Any, Callable
from support.utils import generate_response
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, DEFAULT_SETTINGS_MAP, DEFAULT_TEMPLATE_MAP

# not using sqlalchemy because i am using this to learn sql.
# will i regret it? i already do...

class Database:
    def __init__(self, db_str: str):
        '''Mapping columns: category, key, value
        Settings columns: category, setting, value'''
        self.con: sqlite3.Connection = sqlite3.connect(db_str, check_same_thread=False)

        mapping_columns = ['category TEXT', 'key TEXT PRIMARY KEY', 'value TEXT']

        # this is pretty annoying but category is used due to the mapping columns.
        # granted, i could just separate the two but i am too lazy to refactor.
        # FIXME: maybe?
        settings_columns = ['category TEXT', 'key TEXT PRIMARY KEY', 'value']
        tables: list[tuple[str]] = [
            ('mapping', ",".join(mapping_columns)), 
            ('settings', ",".join(settings_columns))
        ]

        for name, columns in tables:
            self._create_table(table=name, columns=columns)
        
        self._validate()
    
    def insert(self, *, table: str, 
        columns: list[str] | tuple[str] = [], 
        params: list[Any] | tuple[Any]):
        '''Insert values into a table.
        
        Parameters
        ----------
            table: str
                The name of a table.

            columns: list[str] | tuple[str], default []
                Iterable of columns of the table to replace. By default it is empty.

            params: list[Any], tuple[Any]
                Iterable of parameters to insert into a table.
        '''
        if len(columns) > 0 and len(columns) != len(params):
            # FIXME: do an actual error handle here
            return

        values: str = ",".join(['?' for _ in range(len(params))])
        columns: str = ",".join(columns) if len(columns) > 0 else ''

        sql: str = f'INSERT INTO {table} {columns} VALUES {self._format_string(values)}'

        self.con.execute(sql, params)

        self.con.commit()

    def select(self, *, columns: list[str] = ['*'], table: str, where: str = '') -> list[Any]:
        '''Selects columns from a table.
        
        Parameters
        ----------
            columns: str, default '*'
                The columns to select from, by default it selects all columns.
            
            table: str
                The name of the table being selected from.

            where: str, default ''
                Filter from the table, must be a raw SQL string. 
                Do not include 'WHERE', it is not required.
        '''
        columns: str = ",".join(columns) if len(columns) > 0 else ''

        sql: str = f'SELECT {columns} FROM {table} ' + (f'WHERE {where}' if where != '' else '')
        res: list[Any] = self._execute(sql)

        return res
    
    def update(self, *, table: str, set_: str, where: str = ''):
        '''Update columns in a table.'''
        sql: str = f'UPDATE {table} SET {set_} ' + (f'WHERE {where}' if where != '' else '')
        self._execute(sql)
    
    def delete(self, *, table: str, where: str):
        '''Delete rows in a table based on a condition.

        This should only be used on the "mappings" table.
        '''
        sql: str = f'DELETE FROM {table} WHERE {where}'
        self._execute(sql)
    
    def get_all_rows(self, *, table: str) -> list[Any]:
        '''Get all the rows in a table.'''
        res: list[Any] = self.select(table=table)

        return res
    
    def _validate(self):
        '''Validate database.'''
        def default_insert(table: str, columns: list[str], map_: dict[str, str], 
            column_name: str) -> None:
            '''Helper function to generate any missing defaults.'''
            res: list[Any] = self.select(table=table, columns=columns)

            flat: set[str] = {col[0] for col in res}

            for def_key in map_.keys():
                if def_key not in flat:
                    self.insert(table=table, params=[column_name, def_key, map_.get(def_key)])
                    print(f'Missing {def_key}')
        
        # helper function to generate a tuple for the list below
        # im sorry for this by the way...
        create_tuple: Callable[
            [str, str, dict[str, str]], tuple[str, str, dict[str, str]]
        ] = lambda tb, col, d: (tb, [col], d)
        
        items: list[tuple[str, str, dict[str, str]]] = [
            create_tuple('mapping', 'key', DEFAULT_HEADER_MAP),
            create_tuple('mapping', 'key', DEFAULT_OPCO_MAP),
            create_tuple('mapping', 'key', DEFAULT_TEMPLATE_MAP),
            create_tuple('settings', 'key', DEFAULT_SETTINGS_MAP)
        ]

        # FIXME: temporary thing, could be permanent though. used to fill the columns correctly.
        column_names: list[str] = ['headers', 'opco', 'template', 'setting']

        for i, item in enumerate(items):
            default_insert(item[0], item[1], item[2], column_names[i])
    
    def _execute(self, sql: str) -> list[Any]:
        '''Execute a SQL statement.'''
        cur: sqlite3.Cursor = self.con.cursor()

        # just return res anyways. only select will use this feature.
        res: list[Any] = cur.execute(sql).fetchall()
        
        self.con.commit()
        cur.close()

        return res

    def _create_table(self, *, table: str, columns: str):
        '''Create tables in the database.
        
        This should only be used for validating and initializing the database.
        '''
        sql: str = f'CREATE TABLE IF NOT EXISTS {table} {self._format_string(columns)}'
        self.con.execute(sql)

    def _format_string(self, param: str):
        '''Wraps parentheses around a given parameter if it does not have one.'''
        # if either one is not found then remove all occurrences.
        if not '(' in param or ')' not in param:
            param = param.replace('(', '').replace(')', '')
        
        return f'({param})'