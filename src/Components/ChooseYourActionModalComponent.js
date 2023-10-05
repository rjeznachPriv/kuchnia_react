import './../Styles/ChooseYourActionModalComponent.css';

function ChooseYourActionModalComponent(props) {
    return (
        <div>
            1. Po zeskanowaniu schowka
            - zapytaj czy:
            a.Pokaz liste produktow w danym schowku
            b. Wyjmij produkt
            c. Doloz produkt
            d.Pokaz czego brakuje do minimalnego stanu schowka
            e. Ustal minimalny stan schowka (edycja?)
            2. Po zeskanowaniu znanego produktu
            - Jesli jestes na zakupach to dodaj produkt do koszyka (skresl z listy zakupow)
            - zapytaj czy:
            - Wybrac schowek z ktorego zabrano zeskanowany produkt
            - Wybrac schowek do ktorego Dolozono zeskanowany produkt(Wprowadz date przydatnosci)
            - Ustal ogolny minimalny stan zapasow dla zeskanowanego produktu
            3. Po zeskanowaniu nieznanego kodu
            - Jesli jestes na zakupach to dodaj produkt do koszyka
            - zapytaj czy to produkt/schowek
            -dodaj do bazy znanych produktow/schowkow
            
        </div>
  );
}

export default ChooseYourActionModalComponent;
