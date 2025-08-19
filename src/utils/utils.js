import $ from 'jquery';

export function runSequence(sequence, delay, index = 0) {
    if (index < sequence.length) {
        sequence[index]();
        setTimeout(
            function () {
                runSequence(sequence, delay, index + 1);
            }, delay);
    }
}

export function isAlphaNumericKey(e) {
    return /[0-9a-zA-Z]/i.test(e.key) || [8, 32].some((code) => e.keyCode == code)
}

export function printSvgS(selectors) {
    let elements = selectors.map((selector) => { return $(selector)[0]; });

    var newWindow = window.open('', '', `height=${window.screen.height}, width=${window.screen.height}`);
    newWindow.document.write('<html>');
    elements.forEach((element) => {
        newWindow.document.write(element.outerHTML);
    });

    newWindow.document.write('</html>');
    newWindow.document.close();
    newWindow.print();

    newWindow.onafterprint = () => newWindow.close();
}

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}

export function daysUntil(dateStr, format) {
    // znajdŸ pozycje pól w formacie
    const dayIndex = format.indexOf("dd");
    const monthIndex = format.indexOf("MM");
    const yearIndex = format.indexOf("yyyy");

    // wyci¹gnij wartoœci ze stringa wg pozycji
    const day = parseInt(dateStr.substr(dayIndex, 2), 10);
    const month = parseInt(dateStr.substr(monthIndex, 2), 10);
    const year = parseInt(dateStr.substr(yearIndex, 4), 10);

    const inputDate = new Date(year, month - 1, day);

    // dzisiejsza data bez godzin
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = inputDate - today;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}