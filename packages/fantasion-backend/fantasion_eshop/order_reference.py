"""
The reference number marks unique identifier for the order. It is a
number of 10 digits. Digits 1 and 2 (first two) identify the year.
Digits 3 and 4 are reserved for order specific identification and the
last six digits are reserved for order identification.
"""

from datetime import date


def generate_reference_number_base(order_id: int) -> str:
    ident = str(order_id)
    padding = "0" * (8 - len(ident))
    year = date.today().strftime("%y")
    return f"{year}{padding}{ident}"


def get_order_specific_ident(ref: str) -> int:
    return int(ref[2:4])


def set_order_specific_ident(ref: str, ident: int) -> str:
    id = str(ident)
    if len(id) > 2:
        raise ValueError("Ident must be at most 2 digits long")
    year = ref[:2]
    rest = ref[4:]
    padding = "0" * (2 - len(id))
    return f"{year}{padding}{ident}{rest}"
