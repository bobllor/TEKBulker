from pathlib import Path
from io import BytesIO
import random

def randomizer(_: str, *args) -> str:
    '''Chooses a random element from the given list and returns it.'''
    size: int = len(args)

    return args[random.randint(0, size - 1)]

def get_csv_bytesio(path: Path | str) -> BytesIO:
    with open(path, "r") as file:
        content: list[str] = file.readlines()

    # removing the row for parsing
    content = content[1:]
    csv_bytes: bytes = "".join(content).encode()

    return BytesIO(csv_bytes)