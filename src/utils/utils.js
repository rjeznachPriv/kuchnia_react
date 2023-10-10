export function runSequence(sequence, delay, counter = 0) {
    if (counter < sequence.length) {
        sequence[counter]();
        setTimeout(
            function () {
                runSequence(sequence, delay, counter + 1);
            }, delay);
    }
}