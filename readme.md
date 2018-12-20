## Why a p5 responsive library?

The idea came about when I started to investigate p5 as a possible method for creating data visualizations and other interactive modules on [my blog](https://github.com/liaprins/curiositycoloredglasses.com). p5 seemed like the perfect candidate, but I needed the sketches I'd be building to scale with the breakpoints that the rest of my painstakingly designed site followed. I also wanted to enable full-window, maximized views of the sketches, the same way I'd coded all my blog's images to behave.

p5's canvases and drawn elements are pixel-based, so warping them to my site's responsive design while maintaining their relative proportions took some doing, and (for the short term) a second JavaScript file (to account for some of the full-window functionality). So the example files I've currently uploaded, their designed outputs, and their constants are still formulated to meet the needs of my blog at the moment.


## Next steps

See the [Issues](https://github.com/liaprins/p5.responsive/issues) for more detail on planned next steps. Here's a high-level overview:

- [ ] Genericize sample code (so it's not specific to my blog anymore)
- [ ] Build full-window functionality with p5 instead of relying on separate JS file
- [ ] Learn more about building a library
- [ ] Design ideal experience for using the library from p5 coder's perspective
- [ ] Create the library (and test!)
- [ ] Create documentation with examples



## Quick start!

1. Within sketch.js, change the value of `cHProp` to a number above 100 for a vertical canvas, below 100 for a horizontal canvas, or equal to 100 for a square canvas.

2. Create your sketch within `function draw()` below line 90. For drawn elements that remain proportional to the canvas, size them as percentages of the canvas width (wherein canvas width = 100%), and multiply the numbers by the `prop` variable, e.g. `(7 * prop)`.

3. Try your sketch out on different screensizes and in full-window mode (by clicking the fullscreen icon below the canvas), refreshing the browser between resizes.


## Thorough, in-depth start!

1. Download this project, open the folder, and drag the index.html file into a new browser window or tab.
2. Open the js folder, and then open sketch.js with a code editor.
3. Try changing the values of the variables in lines 5-15, which are described below. More specifically, try changing `cHProp` to experiment with various canvas aspect ratios.
4. Refresh your browser to see the update. Change the width and height of your browser window and refresh again to see how the canvas responded (the responsivity is currently set with JS, not CSS, so will need to refresh for it to update). _Expected behavior: your canvas should keep the same aspect ratio, but fill the screen differently according to the combination of screen width and height, the canvas aspect ratio, and the other variables within sketch.js._
5. Click the little "fullscreen" icon just below the canvas and to the right edge to open the canvas in full-window mode. Try full-window mode in various screen sizes, too (will need to refresh and re-open full-window mode with each screen resize, as of now).
6. Within the `draw()` function, lines 57-87 define JavaScript-mediaqueries (that were needed for my blog's styles). As of now they need to stay there for the drawn elements to scale with the canvas proportionally (I will remove this dependency and/or genericize it soon, with better documentation). Build your sketch **below line 90**; if you want your drawn elements to remain static-sized in pixels and _not_ scale with the canvas, define their sizes and locations as you normally would.
7. If you _do want your drawn elements to scale proportionally with the canvas_, simply define their sizes and locations by percentages of the canvas' width, and multiply by `prop`. _In the example included, the circle is 10% of the canvas' width, so its size is defined as `(10 * prop), (10 * prop)`._ It is possible to have a mix of statically and proportionally sized drawn elements within a single canvas.

#### Global `var`s

As of now, these are the **(currently global) variables** established within lines 5-15 of sketch.js:

- `cWProp` 
  Canvas' proportional width. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. *Keep this defined as it is with* `var cWProp = 100;` *so the canvas can scale properly with screen _width_ changes.*

- `cHProp` 
  Canvas' proportional height. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. **Define this relative to the canvas width being set at 100.** `cHProp` can be set above 100 for a portrait-proportioned canvas, at 100 for a square canvas, or below 100 for a landscape-oriented canvas.

- `cW` 
  Canvas' max width in px for regular view (not in full-window view). Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. *Currently set at* `642`*.*

- `var cH = ((cW * cHProp) / cWProp);` 
  Canvas' max height in px for regular view (not in full-window view); defined as dependent upon `cW` to maintain canvas proportions while scaling. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. 

- `ltMaxW` 
  Canvas' max width in full-window view. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. *Currently set at* `1108`*.*

- `ltWPad;` 
  Aggregate horizontal (W = width) padding in px within full-window mode. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. *Currently the included styling only calls for this to be applied above a breakpoint of 817px screen width and is set at* `117`*.*

- `ltHPad` 
  Aggregate vertical (H = height) padding in px within full-window mode. Used within `function draw()` to maintain drawn-element-size-to-canvas-ratio, if desired. *Currently the included styling only calls for this to be applied above a breakpoint of 817px screen width and is set at* `96`*.*

- `maxPxDensity` 
  Maximum display px density to account for.
  
#### `function setup()`
Within `function setup()` I define `var pE` as a **scalable pixel** in a way, which changes with JavaScript mediaquery-like if-statements (again, this is hyper-specific to my blog's design, and I'll need to consider pulling these breakpoints out into definable variables of their own for the library). `pE` goes on to help define the `prop` unit, equal to 1% of the width of the canvas at any given point. 

#### `function draw()`
`pE` is redefined in `function draw()` according to screen width breakpoints again, as well as whether the sketch is being viewed in full-window or not. Any drawn element's size values can be defined by their desired relative percentage to the canvas' width, as long as the value is multipled by `prop`, e.g. `ellipse(mouseX, mouseY, (10 * prop), (10 * prop))`.
