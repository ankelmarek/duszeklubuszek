"""Package the self-contained build using Python's standard ZIP support."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
html = root / "dist/index.html"
if not html.is_file():
    raise SystemExit("Najpierw uruchom npm run build.")
destination = root / "downloads/duszek-lubuszek-www.zip"
destination.parent.mkdir(exist_ok=True)
instructions = """DUSZEK LUBUSZEK — JAK ZAGRAĆ

1. Rozpakuj ten ZIP do dowolnego folderu.
2. Otwórz index.html dwuklikiem w przeglądarce (np. Chrome, Edge lub Firefox).

Cała gra, style i grafika są w index.html. Nie trzeba instalować programów,
uruchamiać serwera ani mieć połączenia z internetem.

Na stronie WWW: wgraj index.html do wybranego katalogu hostingu statycznego.
Gra działa również w podkatalogu, np. /duszek/.

Pieczątki i odznaka są wirtualną pamiątką z gry.
Nie zastępują pieczątek w książeczce z rzeczywistej akcji turystycznej.
"""
with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
    archive.write(html, "index.html")
    archive.writestr("JAK_URUCHOMIC.txt", instructions)
with ZipFile(destination) as archive:
    if archive.testzip() is not None:
        raise SystemExit("Weryfikacja ZIP nie powiodła się.")
print(f"Gotowe: {destination.relative_to(root)} — samodzielna gra i instrukcja.")
