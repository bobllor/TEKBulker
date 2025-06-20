from pathlib import Path

assets_path: str = 'backend/assets/'

path: Path = Path(assets_path)

if not path.exists():
    path.mkdir()