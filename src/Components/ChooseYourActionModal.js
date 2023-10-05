import './../Styles/ChooseYourActionModal.css';

function ChooseYourActionModal(props) {
    return (
        <div>
            1. Po zeskanowaniu schowka
            - Pokaz liste produktow w danym schowku
            - Wyjmij produkt
            - Doloz produkt
            - Pokaz czego brakuje do minimalnego stanu schowka
            - Ustal minimalny stan schowka (edycja?)
            2. Po zeskanowaniu znanego produktu
            - Wybierz schowek z ktorego zabrano
            - Doloz do wybranego schowka(Wprowadz date przydatnosci)
            - Ustal ogolny minimalny stan
            3. Po zeskanowaniu nieznanego kodu
            - zapytaj czy to produkt/schowek
            -dodaj do bazy znanych produktow/schowkow
        </div>
  );
}

export default ChooseYourActionModal;
