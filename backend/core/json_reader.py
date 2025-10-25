from logger import Log
from pathlib import Path
from typing import Any, Literal
from support import utils
import json

class Reader:
    def __init__(self, path: Path | str, *, 
        defaults: dict[str, Any] = None, 
        logger: Log = None,
        is_test: bool = False):
        '''Used to support CRUD operations on JSON data for the program.
        
        Parameters
        ----------
            path: Path | str
                A StrPath of the JSON file. All folders will be created up to the file.
            
            defaults: dict[str, Any], default None
                The default data that must exist in the file. These are the default values
                of the settings. If given, it will validate and correct the default values only.
            
            logger: Log, default None
                The logger, by default it is None- creating a new instance with no special features.
            
            is_test: bool, default False
                Boolean to indicate if the Reader is a test instance or not.
        '''
        self.path: Path = Path(path) if isinstance(path, str) else path
        self._name: str = self.path.name

        self.logger: Log = logger or Log()
        self._is_test: bool = is_test

        self._mkfiles()

        self._content: dict[str, Any] = self.read()
        self._defaults = defaults
        if defaults:
            self.validate_defaults(defaults)
    
    def get_content(self) -> dict[str, Any]:
        '''Returns the dictionary contents.'''
        return self._content

    def read(self) -> dict[str, Any]:
        '''Returns the contents of the .json file in a dictionary format.'''
        content: dict[str, Any] = {}
        with open(self.path, "r") as file:
            content = json.load(file)
        
        return content

    def write(self, data: dict[str, Any]) -> None:
        '''Writes data to the file.'''
        # only write, append does not work.
        with open(self.path, "w") as file:
            json.dump(data, file)
    
    def insert(self, key: str, value: Any) -> dict[str, Any]:
        '''Inserts a single key-value pair into the structure.

        It returns a response in the form of a dictionary.
        '''
        if key in self._content:
            self.logger.warning(f"Insertion failed: key {key} already exists")
            return utils.generate_response(status="error", message="Failed to insert, key already exists")

        self._content[key] = value
        self.write(self._content) 

        self.logger.info(f"Inserted key {key} with value: {value}")

        return utils.generate_response(message=f"Successfully inserted {key}", status_code=200)
    
    def insert_many(self, data: dict[str, Any]) -> dict[str, Any]:
        '''Inserts multiple key-value pairs into the structure.''' 
        success_ops: int = 0
        for key, value in data.items():
            if key in self._content:
                self.logger.warning(f"Insertion failed: key {key} already exists")
                continue

            self._content[key] = value
            self.logger.info(f"Inserted key {key} with value: {value}")
            success_ops += 1

        self.write(self._content) 

        data_len: int = len(data)
        self.logger.info(
            f"Inserted into {self._name} with "
            f"{data_len} {'items' if data_len == 0 or data_len > 1 else 'item'}"
        )

        return utils.generate_response(
            message=f"Inserted {success_ops}/{len(data)} values, failed: {len(data) - success_ops}", 
            status_code=200
        )
    
    def update(self, key: str, value: Any) -> dict[str, Any]:
        '''Updates a key with the value.
        
        A dictionary response is generated and returned, indicating the status and message.
        '''
        if key not in self._content:
            self.logger.error(f"Update failed: key {key} does not exist")
            return utils.generate_response(status="error", message="Failed to update key", status_code=500)

        self._content[key] = value
        self.write(self._content)

        self.logger.info(f"Updated {key} with {value}")

        return utils.generate_response(message=f"Successfully updated key {key}", status_code=200)
    
    def delete(self, key: str) -> dict[str, Any]:
        '''Deletes a key from the file.'''
        if key in self._defaults and not self._is_test:
            self.logger.warning(f"Default key {key} was attempted to be deleted")
            return utils.generate_response(status="error", message="Failed to delete key", status_code=400)
        elif key not in self._content:
            self.logger.info(f"Key {key} does not exist in {self._content} for removal")
            return utils.generate_response(status="error", message="Unable to find key", status_code=500)
        
        del self._content[key]
        self.write(self._content)

        self.logger.info(f"Deleted key {key}")
        return utils.generate_response(message=f"Successfully deleted {key}")
    
    def get(self, key: str, *, data: dict[str, Any] = None) -> Any:
        '''Gets the value stored at the key.
        
        If the key cannot be found, then None is returned.

        Parameters
        ----------
            key: str
                The key that is being searched for.
            
            data: dict[str, Any], default None
                The data dictionary. When calling the method, **do not pass data** into this
                argument. The only acceptable data is the **`Reader` content**, which by default
                is set to the content if it is `None`.
        '''
        if data is None:
            data = self._content
        if key in data:
            return data[key]
        
        for c_value in data.values():
            if isinstance(c_value, dict):
                value: Any = self.get(key, data=c_value)

                if value is not None:
                    return value
        
        return None

    def _mkfiles(self):
        '''Creates the file, including all directories. If they exist, then this does nothing.'''
        if not self.path.parent.exists():
            self.path.parent.mkdir(parents=True, exist_ok=True)
        
        if not self.path.exists():
            self.path.touch()
            # need to initialize it with a empty data
            with open(self.path, "w") as file:
                file.write("{}")

            self.logger.info(f"Created JSON file: {self.path}")
    
    def validate_defaults(self, data_to_check: dict[str, Any]):
        '''Validates a JSON file for any incorrect values or missing keys from
        a given data dictionary. 

        If it is missing or it has an invalid value then it will correct the data.
        '''
        has_corrected: bool = False
        for d_key, d_value in data_to_check.items():
            exists: bool = d_key in self._content
            if not exists or not isinstance(self._content[d_key], type(d_value)):
                self._content[d_key] = d_value

                if not exists:
                    self.logger.info(f"Default key {d_key} added with value {d_value}")
                elif not isinstance(self._content[d_key], type(d_value)):
                    self.logger.info(f"Incorrect default key {d_key} value given")

                if not has_corrected: 
                    has_corrected = True
        
        if has_corrected:
            self.write(self._content)