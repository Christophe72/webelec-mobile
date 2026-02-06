#!/usr/bin/env python3
import os
from pathlib import Path

def rename_md_to_uppercase(folder: Path) -> None:
    for p in folder.iterdir():
        if not p.is_file():
            continue
        if p.suffix.lower() != ".md":
            continue

        # Nom en majuscules, extension .md en minuscule
        new_name = p.stem.upper() + ".md"
        new_path = p.with_name(new_name)

        if new_path == p:
            continue  # déjà OK

        if new_path.exists():
            print(f"[SKIP] {p.name} -> {new_name} (déjà existant)")
            continue

        print(f"[RENAME] {p.name} -> {new_name}")
        p.rename(new_path)

if __name__ == "__main__":
    here = Path(__file__).resolve().parent
    rename_md_to_uppercase(here)
