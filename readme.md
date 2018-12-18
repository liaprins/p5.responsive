## Why a p5 responsive library?

The idea came about when I started to investigate p5 as a possible method for creating data visualizations and other interactive modules on [my blog](https://github.com/liaprins/curiositycoloredglasses.com). p5 seemed like the perfect candidate, but I needed the sketches I'd be building to scale with the breakpoints that the rest of my painstakingly designed site followed. I also wanted to enable full-window, maximized views of the sketches, the same way I'd coded all my blog's images to behave.

p5's canvases and drawn elements are pixel-based, so warping them to my site's responsive design while maintaining their relative proportions took some doing, and (for the short term) a second JavaScript file (to account for some of the full-window functionality). So the example files, their designed outputs, and their constants are still formulated to meet the needs of my blog.

*See the [Issues](https://github.com/liaprins/p5.responsive/issues) for planned next steps.*

## How it works

As of now, these are the variables established within 5-15 of sketch.js:

- `cWProp` Canvas' proportional width. *Keep this defined as it is with* `var cWProp = 100;` *so the canvas can scale properly with screen _width_ changes.*
- `cHProp` Canvas' proportional height. **Define this relative to the canvas width being set at 100.** `cHProp` can be set above 100 for a portrait-proportioned canvas, at 100 for a square canvas, or below 100 for a landscape-oriented canvas.
- `cW` Canvas' max width in px for regular view (not in full-window view). *Currently the included styling (horizontal centering, etc) is optimized for a measure of* `642`*.*
- `var cH = ((cW * cHProp) / cWProp);` Canvas' max height in px for regular view (not in full-window view); defined as dependent upon `cW` to maintain canvas proportions while scaling. 
- `ltMaxW` Canvas' max width in full-window view. *Currently the included styling (horizontal centering, etc) is optimized for a measure of* `1108`*.*
- `ltWPad;` Aggregate horizontal (W = width) padding in px within full-window mode. *Currently the included styling only calls for this to be applied above a breakpoint of 817px screen width and is optimized for a measure of* `117`*.*
- `ltHPad` Aggregate vertical (H = height) padding in px within full-window mode. *Currently the included styling only calls for this to be applied above a breakpoint of 817px screen width and is optimized for a measure of* `96`*.*
- `maxPxDensity` Maximum display px density to account for.
