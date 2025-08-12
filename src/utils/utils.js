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