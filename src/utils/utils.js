import $ from 'jquery';

export function runSequence(sequence, delay, counter = 0) {
    if (counter < sequence.length) {
        sequence[counter]();
        setTimeout(
            function () {
                runSequence(sequence, delay, counter + 1);
            }, delay);
    }
}

export function isAlphaNumericKey(e) {
    return /[0-9a-zA-Z]/i.test(e.key) || [8, 32].some((code) => e.keyCode == code)
}

export function printSvg(selector) {
    var content = $(selector)[0].outerHTML;                 //outerHtml for printing svg as graphics
    var newWindow = window.open('', '', 'height=500, width=500');
    newWindow.document.write('<html>');
    newWindow.document.write(content);
    newWindow.document.write('</html>');
    newWindow.document.close();
    newWindow.print();

    newWindow.onafterprint = () => newWindow.close();
}
