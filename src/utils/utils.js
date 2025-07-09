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

export function printSvg(selector) {
    var content = $(selector)[0].outerHTML;                         //outerHtml for printing svg as graphics
    var newWindow = window.open('', '', 'height=800, width=800');   //TODO: 800 x 800 magic number
    newWindow.document.write('<html>');
    newWindow.document.write(content);
    newWindow.document.write('</html>');
    newWindow.document.close();
    newWindow.print();

    newWindow.onafterprint = () => newWindow.close();
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}