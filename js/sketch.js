// establishing pE (Pixel Equivalent) = equivalent for screensizes <817px
// (or any screensize within lightbox mode)

// canvas dimensions in reg view, at 817+
var cWProp = 100; // ALWAYS; DON'T CHANGE!
var cHProp = 50; // DO CHANGE THIS ACCORDING TO ASPECT RATIO I WANT FOR CANVAS (with 100 always being width)
var cW = 642; // MAX WIDTH WITHIN REGULAR VIEW (NOT LIGHTBOX MODE, WHERE IT CAN BE EVEN WIDER IF DESIRED)
var cH = ((cW * cHProp) / cWProp);
// canvas' max allowed width within lightbox
var ltMaxW = 1108;
// aggregate horizontal (W = width) and vertical (H = height) padding within lightbox, above 817px
var ltWPad = 117;
var ltHPad = 96;
// maximum display px density to account for
var maxPxDensity = 2;



function setup() {

    // FOR NOW ONLY SIZNG CANVAS WHEN IT'S IN REG VIEW (NOT LIGHTBOX MODE)
    // canvasfullscreen.js IS SIZING CANVAS WITHIN LIGHTBOX FOR NOW
    if (windowWidth < 817) {
        var pE = (((windowWidth / 28) * 22) / cW);
    } else {
        var pE = 1;
    }

    // "prop" for now (short for proportion); so I can size things relative to the canvas as a whole,
    // rather than thinking of px sizes for draw() elements that only apply to 817+ in reg view...
    var prop = ((cW * pE) / 100);
    
    // ALWAYS; DON'T CHANGE! SET CANVAS ASPECT RATIO ABOVE WITH cHProp VARIABLE (~ line 6)
    var canvas = createCanvas((cWProp * prop), (cHProp * prop), ((windowWidth / 2) - ((cWProp * prop) / 2)), 0);
    pixelDensity((ltMaxW * maxPxDensity) / cW);    // account for high res screens (maxPxDensity) + scaling from regular view's max width (cW) up to lightbox view's max width (ltMaxW)

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');

    background(255, 0, 200);
}



function draw() {

    // "prop" for now (short for proportion); so I can size things relative to the canvas as a whole,
    // rather than thinking of px sizes for draw() elements that only apply to 817+ in reg view...
    var prop = (cW / 100);

    var sketchHolder = document.getElementById('sketch-holder');

    // ESTABLISHING PROPORTIONAL SIZING UNIT RELATIVE TO CANVAS AT ANY GIVEN SCREENWIDTH, AND LIGHTBOX MODE VS NOT

    // "Is it being viewed in lightbox mode?"
    // if yes, in lightbox mode
    if (sketchHolder.classList.contains('sketch-lightbox')) {
        if (windowWidth >= 1225) {
            // "Is ratio of [windowWidth / windowHeight] < [cw / cH]?"
            // portrait-ish
            if (((windowWidth - ltWPad) / (windowHeight - ltHPad)) > (cW / cH)) {
                var pE = ((windowHeight - ltHPad) / cH);
            } else { // landscape-ish
                var pE = (ltMaxW / cW);
            }
        } else if (windowWidth >= 817) {
            // portrait-ish
            if (((windowWidth - ltWPad) / (windowHeight - ltHPad)) > (cW / cH)) {
                var pE = ((windowHeight - ltHPad) / cH);
            } else { // landscape-ish
                var pE = ((windowWidth - ltWPad) / cW);
            }
        } else { // <817
            // portrait-ish
            if ((windowWidth / windowHeight) > (cW / cH)) {
                var pE = (windowHeight / cH);
            } else { // landscape-ish
                var pE = (windowWidth / cW);
            }
        }
    } else { // no, not in lightbox mode
        if (windowWidth >= 817) {
            var pE = 1;  // a.k.a. worth 1px
        } else {
            var pE = (((windowWidth / 28) * 22) / cW); 
        }
    }

    // draw fun stuff now!
    if(mouseIsPressed) {
        fill(0);
    } else {
        fill(0, 0, 255);
    }
    ellipse(mouseX, mouseY, (10 * prop), (10 * prop)); // 
}















