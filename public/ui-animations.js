// UI animations
function animateTransition(containerSelector, ms) {
    animateTransitionFromTo(".statediv", containerSelector, ms);
};

function animateTransitionFromTo(from, to, ms) {
    var animateFrom = $(from);
    var animateTo = $(to);

    animateFrom.fadeOut(ms);
    animateTo.delay(ms).fadeIn(ms);
}