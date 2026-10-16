# Szlakiem Duszka Lubuszka

Polskojęzyczny prototyp gry przeglądarkowej dla dzieci w wieku 8–9 lat, oparty na opisie i wizerunku postaci przesłanych przez użytkownika. Osiem przystanków, po jednej zagadce do każdego, wirtualny paszport i odznaka do pobrania. Bez kont, limitu czasu i kar. Miejsca można wybierać w dowolnej kolejności.

## Miejsca

1. Zamek Książąt Lubomirskich w Lubniewicach — żaglówka.
2. Zamek Piastowski w Międzyrzeczu — klucz.
3. Zamek Joannitów w Łagowie — flaga.
4. Pałac w Zaborze — motyl.
5. Park Książęcy w Zatoniu — fontanna.
6. Zamek Piastowski w Kożuchowie — książka.
7. Pałac Książęcy w Żaganiu — zegar.
8. Park Dworski i Pałac w Iłowej — mostek.

Każda poprawna odpowiedź przyznaje jedną wirtualną pieczątkę. Po zebraniu ośmiu można zapisać odznakę jako samodzielny plik SVG z osadzoną grafiką postaci. Wirtualne pieczątki nie potwierdzają wizyt w zabytkach i nie uprawniają do odbioru maskotki w rzeczywistej akcji. Informacja o prawdziwym szlaku jest dostępna w grze pod przyciskiem „Poznaj prawdziwy szlak”.

## Uruchomienie

Wymagany Node.js 20 lub nowszy. Nie ma pakietów do zainstalowania ani wymaganych sekretów.

```sh
cd /workspace/duszeklubuszek
npm run dev
```

Serwer nasłuchuje na porcie 3000 na wszystkich interfejsach. Można zmienić port przez `PORT=3001 npm run dev`. Zatrzymanie: Ctrl+C. Po zmianie `server.js` należy ponownie uruchomić proces serwera.

```sh
npm test
npm run build
```

`npm test` uruchamia cztery testy: komplet miejsc i dowolną kolejność, brak punktów za błędne/powtórne odpowiedzi, wybór kolejnego nieodwiedzonego miejsca oraz walidację zapisu. `dist/` zawiera kompletną statyczną wersję gry wraz z grafikami, do hostowania w katalogu głównym domeny. `npm start` udostępnia pliki źródłowe, nie katalog `dist/`.

## Sprawdzenie w przeglądarce

1. Na pierwszej planszy kliknij żabę zamiast żaglówki: licznik ma pozostać bez zmian.
2. Użyj podpowiedzi dwa razy: najpierw tekst, potem obwódka wokół odpowiedzi.
3. Rozwiąż zagadkę klawiaturą (Tab, Enter lub Spacja). Sprawdź pojawienie się pieczątki.
4. Przejdź bezpośrednio do Iłowej. Po jej ukończeniu „Dalej” powinno skierować do kolejnego nieodwiedzonego miejsca, z pominięciem odwiedzonych.
5. Odśwież stronę: postęp i wybrane miejsce zostają zachowane. Wybieraj miejsca z górnej nawigacji oraz z paszportu.
6. Zbierz komplet, pobierz i otwórz odznakę. Sprawdź instrukcję gry i informację o szlaku. Anuluj restart, a potem potwierdź go.
7. Sprawdź widok tabletu i telefonu. Obszary dotykowe przedmiotów mają co najmniej 44 × 44 piksele CSS.

Gra działa też, gdy localStorage jest zablokowany (bez trwałego zapisu). Postęp nowej wersji znajduje się pod kluczem `duszek-lubuszek-trail-v2`; zapis poprzedniego prototypu pozostaje nietknięty. Czytanie używa opcjonalnego Web Speech API. Polski głos zależy od przeglądarki i urządzenia; nie jest dostarczany z grą. Dźwięk jest domyślnie wyłączony. Brak zewnętrznych zasobów wymaganych do rozgrywki.

## Materiały i ilustracje

- Treści i lista miejsc pochodzą z opisu przekazanego przez użytkownika, odnoszącego się do [akcji opisanej na lubuskie.pl](https://lubuskie.pl/wiadomosci/20624/zwiedzaj-lubuskie-z-duszkiem-lubuszkiem). Gra nie podaje niezweryfikowanych bieżących godzin otwarcia ani dostępności nagród.
- `assets/duszek.png` jest opracowaniem przesłanego portretu postaci na przezroczystym tle, przygotowanym narzędziem image_gen. Zachowuje białą postać, niebieskie oczy oraz zieloną czapkę z literą L i niebieskim daszkiem. To grafika prototypowa wzorowana na referencji.
- Osiem plansz SVG to autorskie, swobodne ilustracje miejsc. Nie są wiernymi rekonstrukcjami architektury ani mapami do nawigacji terenowej.
- Dane miejsc i zagadek: `src/game.js`. Ilustracje i pieczątki: `src/scenes.js`. Obsługa gry: `src/app.js`.


## Gotowa paczka WWW

[Pobierz ZIP z gotową grą](downloads/duszek-lubuszek-www.zip). Na stronie pliku w GitHub wybierz przycisk pobierania (Download raw file).

ZIP zawiera statyczną wersję tej edycji gry: `index.html`, CSS, JavaScript i grafikę Duszka. Po rozpakowaniu wgraj zawartość do katalogu głównego hostingu stron statycznych. Publikacja kodu w repozytorium nie włącza automatycznie strony WWW.
