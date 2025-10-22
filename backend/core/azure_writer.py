from typing import Any
from support.vars import AZURE_HEADERS, AZURE_VERSION
from pathlib import Path
import pandas as pd

class AzureWriter:
    def __init__(self): 
        '''Azure CSV writing class.'''
        data: dict[str, Any] = {

        }

        self.df: pd.DataFrame = pd.DataFrame()
    
    def write(self, out: Path | str):
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
        
        # required, azure version must be the first row and a single value.
        with open(path, "w") as file:
            file.write(AZURE_VERSION)
        
        self.df.to_csv(path, mode="a")