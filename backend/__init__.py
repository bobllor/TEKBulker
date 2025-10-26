from pathlib import Path
import os

# changing python path to the backend
backend_path: Path = Path(__file__).parent
curr_path: Path = Path(os.getcwd())
if curr_path != backend_path:
    os.chdir(backend_path)