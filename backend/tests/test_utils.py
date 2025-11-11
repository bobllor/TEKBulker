import support.utils as utils

def test_hyphen_name_format():
    base_names: list[str] = [
        "John-Doe Smith",
        "John Doe-Smith",
        "John-Doe Smith-Jane",
        "John Doe-Smith Jane",
        "John-Doe Smith Jane",
        "John-Doe Smith-Jane Name-One"
    ]

    valid_names: set[str] = {"John Smith", "John Jane", "John One"}

    for name in base_names:
        new_name: str = utils.format_hyphen_name(name)

        if new_name not in valid_names:
            raise AssertionError(f"Failed to parse {name} to get one of the valid names: {valid_names}")