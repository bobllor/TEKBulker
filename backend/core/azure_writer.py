from typing import Any, Literal
from support.vars import AZURE_HEADERS, AZURE_VERSION
from core.names import Period
from logger import Log
from pathlib import Path
import pandas as pd

HeadersKey = Literal["name", "username", "password", "first_name", "last_name", "block_sign_in"]

class AzureWriter:
    def __init__(self, *, logger: Log = None): 
        '''Azure CSV writing class, an empty AzureHeaders is initialized
        and must be setup prior to running AzureWriter.write().'''
        self._headers_data: dict[HeadersKey, list[str]] = {
            key: [] for key in AZURE_HEADERS
        }
        
        self.logger: Log = logger or Log()
    
    def set_full_names(self, names: list[str]):
        '''Sets the full names for the data.'''
        self._headers_data["name"] = names
    
    def set_usernames(self, names: list[str], *, opcos: list[str], opco_map: dict[str, str]):
        '''Sets the usernames of the users derived from names. All lists must be the same length and each index
        are expected to correlate to each other.

        Parameters
        ----------
            names: list[str]
                List of names of users.
            
            opcos: list[str]
                List of operating companies.

            opco_map: dict[str, str]
                Operating company map to generate the username, the list of operating companies
                are used to generate the domain name with the names list. 
        '''
        usernames: list[str] = []

        # TODO: need to set this formatter in the frontend for the class and case_ var
        case_var: Literal["upper", "lower", "title"] = "title"
        formatter: Period = Period(case_var)
        # TODO: create a map of functions for the formatter, also need a variable
        # to determine which formatting method to choose

        for i, opco in enumerate(opcos):
            name: str = formatter.replace(names[i])
            username: str = f"{name}@{opco_map.get(opco.lower(), opco_map["default"])}"

            usernames.append(username)
        
        self._headers_data["username"] = usernames
    
    def set_passwords(self, passwords: list[str]) -> None:
        '''Sets the passwords of the data.'''
        self._headers_data["password"] = passwords
    
    def set_block_sign_in(self, capacity: int, blockages: list[str] = []) -> None:
        '''Sets the block sign in for the users.
        
        Parameters
        ----------
            capacity: int
                The max capacity of the list for the CSV. This is obtained from any list
                that is not the blockages list, that are used in AzureWriter. It is used to
                auto generate default values if the blockages list is less than the capacity.

            blockages: list[str]
                List of blockages. If the size of blockages is less than the capacity, then
                the remaining spaces are filled with `No` as the default value.
        '''
        # i am not actually sure how to let the user define these in the frontend.
        if len(blockages) < capacity:
            for _ in range(capacity - len(blockages)):
                blockages.append("No")
            
        self._headers_data["block_sign_in"] = blockages
    
    def set_names(self, names: list[str]) -> None:
        '''Sets the first and last names of the data. If more than two names are given,
        then all non-last names are placed in the first name.'''
        first_names: list[str] = []
        last_names: list[str] = []

        for name in names:
            name_list: list[str] = name.split()

            first_name: str = " ".join(name_list[0:-1])
            last_name: str = name_list[-1]

            first_names.append(first_name)
            last_names.append(last_name)
        
        self._headers_data["first_name"] = first_names
        self._headers_data["last_name"] = last_names
    
    def write(self, out: Path | str) -> None:
        '''Write to a CSV file.
        
        Parameter
        ---------
            out: Path | str
                A StrPath that is the output of the file. All directories will be created
                if the directories does not exist.
        '''
        path: Path = out if isinstance(out, Path) else Path(out)

        if not path.parent.exists():
            path.mkdir(parents=True, exist_ok=True)
        
        # azure version must be specified on the first row.
        with open(path, "w") as file:
            file.write(AZURE_VERSION+"\n")
        
        df: pd.DataFrame = pd.DataFrame(self._headers_data)

        df.to_csv(path, mode="a", index=False)
    
    def get_data(self, key: HeadersKey) -> list[str]:
        '''Gets the specified data.'''
        return self._headers_data[key]