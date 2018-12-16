// INVOKED LATER VIA CALLBACK = only set up where it appears, but called elsewhere, e.g. as a callback function within other function(s)
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION = set up where it appears and then immediately invoked via an event listener in the lines directly after this function finishes


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// LIGHTBOX SCRIPTS FIRST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





// ******************************************************************************************************************************************
// INVOKED LATER VIA CALLBACK ---------------------------------------------------------------------------------------------------------------
// Gets rid of the "#" that would otherwise remain at end of URL after closing an entry by re-clicking the icon + returns the ability to scroll vertically
function removeHashReturnScroll() { 
    // remove #hash
    history.pushState("", document.title, window.location.pathname + window.location.search);
    // return scrollability
    document.documentElement.style.overflow = 'auto';
}





// ******************************************************************************************************************************************
// INVOKED LATER VIA CALLBACK = only set up where it appears, but called elsewhere, e.g. as a callback function within other function(s)
// lightbox screen shows img corresponding to clicked indicator of img
// the functions that later call this function define the "imgToShow" according to the perspective of what was clicked in their corresponding event listener
// e.g. the clicked indicator of the "imgToShow" could be a non-current slide in regular view...
// or a lightbox dot corresponding to a non-current img
// or (not yet coded) a < or > arrow in lightbox view
function lightbox(imgToShow) {


    // --------------------------------------------------------------------------------
    // SET UP LIGHTBOX

    // create lightbox container
    var singleLightbox = document.createElement('div');
        
    // append lightbox to the <figure> element (the parent of imgToShow), since lightbox will be position: fixed; anyway
    imgToShow.parentNode.appendChild(singleLightbox);
        
    // make lightbox able to be id'd later 
    singleLightbox.setAttribute('id', 'singlelightbox');
    
    // so it can be clicked (wherever the image, caption, etc is NOT) to close itself
    singleLightbox.setAttribute('data-lightbox-close', '');
        
    // give lightbox content: the <figure> element of image to show (includes its <figcaption> if there is one) + "x" button
    singleLightbox.innerHTML = singleLightbox.parentNode.innerHTML + '<img src="https://curiositycoloredglasses.com/assets/images/x.svg" alt="close" id="lightboxclose" class="close-x yellowhover" data-lightbox-x>';
        
    // remove unintentionally duplicated lightbox element from original (duplicated when call the HTML of <figure> element it is attached to was duplicated as lightbox's content)
    var duplicate = singleLightbox.lastElementChild.previousElementSibling;
    singleLightbox.removeChild(duplicate);

    // style contents
    var lightboxImg = singleLightbox.firstElementChild;
    lightboxImg.setAttribute('class', 'contentimage singleimage lightboximage');


    // --------------------------------------------------------------------------------
    // SETUP FULLSCREEN TOGGLE

    // for single img only (not galleries)
    if (lightboxImg.nextElementSibling.classList.contains('imgtofullscreen')) {

        var singleImgToFullScreen = lightboxImg.nextElementSibling;
        singleImgToFullScreen.classList.add('hide');

        var singleImgToRegView = document.createElement('img');
        singleImgToRegView.setAttribute('src', 'https://curiositycoloredglasses.com/assets/images/to-regular-view.svg');
        singleImgToRegView.setAttribute('title', 'Close');
        singleImgToRegView.setAttribute('alt', 'Close');
        singleImgToRegView.setAttribute('class', 'imgfullscreentoggle imgtoregview yellowhover');
        // singleImgToRegView.setAttribute('id', 'imgtoregview');
        singleLightbox.appendChild(singleImgToRegView);
        singleImgToRegView.style.top = 'calc(' + window.innerHeight + 'px - 2.11rem)';
    }


    // --------------------------------------------------------------------------------
    // ADD OTHER LIGHTBOX-NECESSARY FUNCTIONALITY

    // call NAMED FUNCTION
    // use JS to vertically center H imgs
    verticallyCenter();
        
    // add #hash
    var imgURL = singleLightbox.firstElementChild.getAttribute('src');
    var imgURLArray = imgURL.split('/');
    location.hash = imgURLArray[imgURLArray.length - 1];   

    // stop V scrollability
    document.documentElement.style.overflow = 'hidden';


    // --------------------------------------------------------------------------------
    // DEFINE + FLESH OUT CAPTION + CAPTION TOGGLE

    // caption, if there is one
    var caption = document.querySelector('div>figcaption'); // this var distinguishes lightbox caption from a regular caption, because no where else would <figcaption> be direct child of a <div>
    if (caption) {

        // give caption attributes
        caption.setAttribute('class','xs-textface lightboxcaption hide');
        caption.style.display = "none"; // since I want caption to start out closed; if I want it to start open, would instead need: caption.style.display = "block";    
            
        // add caption toggle icon
        var captionToggle = document.createElement('img');
        captionToggle.setAttribute('src', 'https://curiositycoloredglasses.com/assets/images/up-arrowhead.svg');
        captionToggle.setAttribute('title', 'Toggle caption visibility');
        captionToggle.setAttribute('alt', 'Toggle caption visibility');
        captionToggle.setAttribute('id', 'captiontoggle');
        // captionToggle.setAttribute('class', 'close-x yellowhover turn180'); // use this line instead of the next if I want chevron to start in the other direction it does now
        captionToggle.setAttribute('class', 'close-x yellowhover');
        captionToggle.setAttribute('captiontoggle', '');
        singleLightbox.appendChild(captionToggle);

    } // close if (caption)

    
    ////////////////////////////////////////////
    // DOM order within non-gallery lightbox is:
    // 1.) lightboxImg
    //[2.) caption  (OPTIONAL!)]
    // 2.) [or 3.)] "x"
    // 3.) [or 4.)] .captionToggle 
    
    // turning on an event listener only when lightbox is open; this way hitting "escape" key can close lightbox (via "function addESC()")
    document.addEventListener('keydown', addESC);

} // close function





// ******************************************************************************************************************************************
// INVOKED LATER VIA CALLBACK ---------------------------------------------------------------------------------------------------------------
// responsible for establishing + properly filling the lightbox dots + setting up arrows within lightbox view
function populateLightboxDots(imgToShow) { // imgToShow is the image that should be shown within the lightbox
    
    // if imgToShow is a gallery img
    if (imgToShow.getAttribute('id') == ('galleryimage')) {
            
        
        // --------------------------------------------------------------------------------
        // LIGHTBOX DOTS
    
        // create container to hold dots, within lightbox
        var lightboxDotContainer = document.createElement('div');
        lightboxDotContainer.setAttribute('id', 'lightboxdotcontainer');

        // fill with contents of non-lightbox (regular view) dot container
        lightboxDotContainer.innerHTML = imgToShow.parentNode.parentNode.parentNode.lastElementChild.innerHTML; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

        // attach to lightbox
        var lightbox = document.getElementById('singlelightbox');
        lightbox.appendChild(lightboxDotContainer);


        // --------------------------------------------------------------------------------
        // LIGHTBOX ARROWS

        // create + set up container to hold arrows, within lightbox
        var lightboxArrowContainer = document.createElement('div');
        lightbox.appendChild(lightboxArrowContainer);
        lightboxArrowContainer.setAttribute('class', 'arrowcontainer lightboxarrowcontainer');
        lightboxArrowContainer.innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/left-arrowhead.svg" alt="retreat" title="Previous image" class="galleryarrows lightboxarrows yellowhover" data-retreatlightboxarrow>' + '<img src="https://curiositycoloredglasses.com/assets/images/right-arrowhead.svg" alt="advance" title="Next image" class="galleryarrows lightboxarrows yellowhover" data-advancelightboxarrow>' + '<img class="imgfullscreentoggle imgtoregview yellowhover" title="View larger" id="galleryimgtoregview" alt="View larger" src="https://curiositycoloredglasses.com/assets/images/to-regular-view.svg">';


        ////////////////////////////////////////////
        // DOM order within gallery lightbox is:
        // 1.) lightboxImg
        //[2.) caption  (OPTIONAL!)]
        // 2.) [or 3.)] "x"
        // 3.) [or 4.)] captionToggle 
        //[4.) [or 5.)] lightboxDotContainer (OPTIONAL!)]
        //[5.) [or 6.)] lightboxArrowContainer (OPTIONAL!)]

    } // close gallery-if
} // close function





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// invoked when a regular-view img is clicked (if img is within a gallery, it must be the focus img, which is defined in the first if-statement below, because only the focus img has the "clickme" class)
function clickRegularViewFocusImg(e) {

    var clickedThing = e.target;
    
    // if clicked element is a single image or the focus img in a gallery
    if (clickedThing.classList.contains('clickme')) {

        // define imgToShow
        var imgToShow = clickedThing;

        // call NAMED lightbox function
        lightbox(imgToShow);

        // call NAMED function to populate lightbox dots
        populateLightboxDots(imgToShow);

    } // close if ('clickme')
} // close function

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to clicks on any post-content image within content zone (not edgelings), in regular view
window.addEventListener('click', clickRegularViewFocusImg, false);





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// invoked when fullscreen button is clicked within regular view
function clickToFullScreenButton(e) {

    var clickedThing = e.target;
    
    // if clicked element is a single image or the focus img in a gallery
    if (clickedThing.classList.contains('imgtofullscreen')) {

        var toFullScreen = clickedThing;

        // if it is part of a single img (non-gallery)
        if (toFullScreen.previousElementSibling.classList.contains('clickme')) {

            // define imgToShow
            var imgToShow = toFullScreen.previousElementSibling;

            // call NAMED lightbox function
            lightbox(imgToShow);

            // call NAMED function to populate lightbox dots
            populateLightboxDots(imgToShow);

        } else { // it must be part of a gallery

            var currentGallery = toFullScreen.parentNode.parentNode;
            var galleryName = currentGallery.getAttribute('id');

            for (i = 0; i < (currentGallery.children.length - 3); i++) {

                if (currentGallery.children[i].getAttribute('id') == galleryName + '-current') {

                    // define imgToShow
                    var imgToShow = currentGallery.children[i].firstElementChild.firstElementChild;

                    // call NAMED lightbox function
                    lightbox(imgToShow);

                    // call NAMED function to populate lightbox dots
                    populateLightboxDots(imgToShow);

                }

            } // close for loop

        }

    } // close if ('clickme')
} // close function

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to clicks on any post-content image within content zone (not edgelings), in regular view
window.addEventListener('click', clickToFullScreenButton, false);





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// toggles lightbox caption open/closed
function toggleCaption(e) {

    var clickedThing = e.target;

    if (clickedThing.hasAttribute('captiontoggle')) {

        var captionToggle = clickedThing;
        captionToggle.classList.toggle('turn180');

        var caption = document.querySelector('div>figcaption');
        // captionToggle.previousElementSibling.previousElementSibling.removeAttribute('style');
        caption.removeAttribute('style');
        // captionToggle.previousElementSibling.previousElementSibling.classList.toggle('hide');
        caption.classList.toggle('hide');

        // if I want dots to hide at the same time, add this line: captionToggle.nextElementSibling.classList.toggle('hide');
    }
}

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to clicks on caption toggle
window.addEventListener('click', toggleCaption, false);





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// close lightbox by (clicking "x") OR (white space) OR (fullscreen toggle button)
function lightboxClose(e) {

    clickedThing = e.target;
    
    if ((clickedThing.hasAttribute('data-lightbox-close')) || (clickedThing.hasAttribute('data-lightbox-x')) || (clickedThing.classList.contains('imgtoregview'))) {

        // tear down lightbox
        var lightbox = document.getElementById('singlelightbox');
        lightbox.parentNode.removeChild(lightbox);
        

        // --------------------------------------------------------------------------------
        // ADD OTHER LIGHTBOX-REMOVAL FUNCTIONALITY
        
        // is turned on when lightbox is open, and only needed when it's open, so removing to save resources when not needed
        document.removeEventListener('keydown', addESC);
        
        // remove #hash from URL and allow page to scroll again once lightbox is closed
        removeHashReturnScroll();
    }
}

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to clicks on white space surrounding lightbox image
window.addEventListener('click', lightboxClose, false);





// ******************************************************************************************************************************************
// INVOKED EARLIER VIA CALLBACK event listener turned on within last line (~100) OF "function lightbox(imgToShow)" --------------------------
// escape key to exit from lightbox
var addESC = function(e) {
  if (e.keyCode == 27) {
    var lightbox = document.getElementById('singlelightbox');
    lightbox.parentNode.removeChild(lightbox);
    document.removeEventListener('keydown', addESC); // is turned on when lightbox is open, and only needed when it's open, so removing to save resources when not needed
    // CALLBACK FUNCTION
    removeHashReturnScroll();
  } 
}





// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// SLIDESHOW SCRIPTS BEGIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// if there are galleries, create them into slideshows
function slideshow() {    

    // establish vars
    var galleryList = document.getElementsByClassName('gallery'); // find any/all galleries in the blogpost
    var screenWidth = window.innerWidth; // get screen width
    var galleryCaptionList = document.getElementsByClassName('gallerycaption');


    // --------------------------------------------------------------------------------
    // FOR ALL CAPTIONS WITHIN A GALLERY

    // hide all captions to start
    for (h = 0; h < galleryCaptionList.length; h++) {
        galleryCaptionList[h].style.display = "none";
    }    // close h


    // --------------------------------------------------------------------------------
    // FOR ALL GALLERIES
    
    // for each gallery
    for (i = 0; i < galleryList.length; i++) {

        // all gallery-specific vars
        var galleryName = galleryList[i].getAttribute('id'); // declare the gallery's name, so it can be identified later vs other galleries on the page
        var arrowContainer = document.createElement('div');
        var placeholderBox = document.createElement('div');
        var dotsContainer = document.createElement('span');
        var figure = galleryList[i].firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!! 
        var firstCaption = figure.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

        // create advance/retreat arrows for each gallery
        galleryList[i].appendChild(arrowContainer);
        arrowContainer.setAttribute('class', 'arrowcontainer');
        arrowContainer.style.position = 'relative';
        arrowContainer.innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/left-arrowhead.svg" alt="retreat" title="Previous image" class="galleryarrows yellowhover" data-retreatarrow>' + '<img src="https://curiositycoloredglasses.com/assets/images/right-arrowhead.svg" alt="advance" title="Next image" class="galleryarrows yellowhover" data-advancearrow>' + '<img class="imgfullscreentoggle imgtofullscreen yellowhover" title="View larger" alt="View larger" src="https://curiositycoloredglasses.com/assets/images/to-full-screen.svg">';

        // establish placeholder box to keep text after img at proper height
        galleryList[i].appendChild(placeholderBox);
        placeholderBox.style.position = 'relative';
        placeholderBox.style.top = '1.024rem';    // this size works for 1225+ only ...see if this can be styled with CSS and mediaqueries instead
        placeholderBox.setAttribute('id', 'placeholderbox');

        // create dots container for each gallery
        galleryList[i].appendChild(dotsContainer);
        dotsContainer.setAttribute('class', 'dotcontainer');
        dotsContainer.setAttribute('id', 'regviewdotcontainer');
        dotsContainer.style.position = 'relative';

        // show first slide's caption, if it has one
        if (firstCaption.hasAttribute('data-galleryfigcaption')) {
            firstCaption.style.display = "block";
        }

        // if the first slide has a caption & the screen is less than 1225px wide
        if ((firstCaption.hasAttribute('data-galleryfigcaption')) && (screenWidth < 1225)) {
            
            // if there is a caption, set the <figure> element as the placeholder box's height (just the height of the <figure> element)
            placeholderBox.style.height = 'calc(' + figure.offsetHeight + 'px)';
        
        } else {

            // add some extra spacing if 1225+ (caption will be in edgeling, not below img) or if there is no caption (therefore not caption below img regardless of screenwidth)
            placeholderBox.style.height = 'calc(1.072rem + ' + figure.offsetHeight + 'px)';
        }

        
        // --------------------------------------------------------------------------------
        // FOR ALL SLIDES WITHIN EACH GALLERY

        // for each slide within each gallery (but subtract 3 to keep from counting the arrowContainer, dotsContainer and placeholderBox as children)
        for (j = 0; j < (galleryList[i].children.length - 3); j++) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION (e.g. may need to be "- 4" instead) !!!

            // slide-specific vars
            var dot = document.createElement('span');
            var slide = galleryList[i].children; // <li> item (containing <figure>)

            // create dots + put dots into dots container (positioned later, once placeHolderBox and img heights established)
            dot.setAttribute('class', 'dot dotunfilled');
            dot.innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/dot.svg" alt="go to this slide" class="dotimg dotimgunfilled">';
            dotsContainer.appendChild(dot);
            dotsList = dotsContainer.children;
            dotsList[j].setAttribute('data-dot-index', (j));
            dotsList[j].setAttribute('data-galleryname', galleryName); // store the gallery name as an attribute so it can be pulled in a later function to find and declare the gallery
            
            // then override the first dot, to indicate it is the current dot/slide
            dotsList[0].setAttribute('class', 'dot');
            dotsList[0].innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/dot-filled.svg" alt="go to this slide" class="dotimg dotimgfill">';

            // position all slides' <li> elements horizontally (absolute) + add data-* attribute to recognize them as side slides if clicked on
            slide[j].setAttribute('data-slide-index', (j));
            slide[j].setAttribute('data-sideslide', '');
            slide[j].style.position = "absolute";

            // position slides at increments equal to the post text width + 1 margin
            if (screenWidth < 817) {
                slide[j].style.left = 'calc(85.714vw * ' + j + ')';
            } else {
                slide[j].style.left = 'calc(700px * ' + j + ')';
            }

            // position <figure> element vertically (relative) within <li> element, so it can be even with top of first slide
            slide[j].firstElementChild.style.position = "relative";    // styling <figure> to be relatively positioned within <li> which is absolutely positioned
            
            // set first slide up as "current slide"
            slide[0].removeAttribute('data-sideslide');
            slide[0].firstElementChild.style.top = '0'; // first slide's <figure> item
            slide[0].setAttribute('id', galleryName + '-current');

            // making current img clickable to open lightbox (in a different function), by adding "clickme" class
            slide[0].firstElementChild.firstElementChild.setAttribute('class', 'contentimage clickme'); // first slide's <img> element // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            
            // make first slide's caption NOT have a white left edge (so it won't cover home glasses) but subsequent slides need the white left edge as a border with previous image behind, so this only applies to first image
            if (slide[0].firstElementChild.lastElementChild.hasAttribute('data-galleryfigcaption')) { // if it has the attribute, it's a <figcaption> // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                
                var firstGalleryCaption = slide[0].firstElementChild.lastElementChild; // <figcaption> // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                firstGalleryCaption.setAttribute('class', 'xs-textface caption gallerycaption whiteedge');
            }

            // position dotsContainer
            dotsContainer.style.top = 'calc(-' + (placeholderBox.offsetHeight - slide[0].firstElementChild.firstElementChild.offsetHeight) + 'px + 1.536rem)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

            // position arrows
            arrowContainer.style.top = 'calc(' + (slide[0].firstElementChild.firstElementChild.offsetHeight) + 'px + 1.024rem)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            arrowContainer.style.left = 0;

        }   // close j
    }   // close i

    // when page is refreshed, this removes the lightbox's #hash from the URL, since refreshing the page automatically also removes the lightbox view, so this syncs the URL back up with the view onscreen
    removeHashReturnScroll();

}   // close function

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// creates slideshow from galleries on page load (must be on load, not DOMContentLoaded because this needs to run after all images have rendered, or it won't know their heights and will cause text to render atop gallery)
window.addEventListener('load', slideshow, false);





// ******************************************************************************************************************************************
// INVOKED LATER VIA CALLBACK ---------------------------------------------------------------------------------------------------------------
// called when a regular-view sideslide or dot is clicked
// several parameters are declared, all of which need to be defined in the functions that call this in turn call function as a CALLBACK FUNCTION within them...
// ...from the perspective of what was clicked for that function (e.g. sideslide, dot, etc)
// causes slideshow to move to the indicated slide
function advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide) {

    // establish vars
    var dotsList = dotsContainer.children;
    var placeholderBox = gallery.lastElementChild.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!    
    var arrowContainer = placeholderBox.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    var screenWidth = window.innerWidth;

    // compare dot index to selected img index
    for (k = 0; k < dotsList.length; k++) {
        if (k == clickedIndex) {
            dotsList[k].setAttribute('class', 'dot');
            dotsList[k].innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/dot-filled.svg" alt="go to this slide" class="dotimg dotimgfill">';
        } else {
            dotsList[k].setAttribute('class', 'dot dotunfilled');
            dotsList[k].innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/dot.svg" alt="go to this slide" class="dotimg dotimgunfilled">';
        } // close if
    } // close k


    // --------------------------------------------------------------------------------
    // MOVE ENTIRE GALLERY; DISTANCE DETERMINED BY SCREENWIDTH (JS-STYLE MEDIAQUERY)

    if (screenWidth < 817) {
        gallery.style.right = 'calc(85.714vw * ' + clickedIndex + ')'; // moves entire gallery
        placeholderBox.style.right = 'calc(-85.714vw * ' + clickedIndex + ')'; // keeps placeholderBox in current slide position + reflects its height: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the first slide
        dotsContainer.style.left = 'calc(85.714vw * ' + clickedIndex + ')'; // keeps dotsContainer in current slide position: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the front of the gallery
        arrowContainer.style.left = 'calc(85.714vw * ' + clickedIndex + ')'; // keeps arrows in current slide position: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the front of the gallery
        arrowContainer.style.top = 'calc(' + clickedSideSlide.firstElementChild.offsetHeight + 'px + 1.024rem)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    } else {
        gallery.style.right = 'calc(700px * ' + clickedIndex + ')'; // moves entire gallery
        placeholderBox.style.right = 'calc(-700px * ' + clickedIndex + ')'; // keeps placeholderBox in current slide position + reflects its height: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the first slide
        dotsContainer.style.left = 'calc(700px * ' + clickedIndex + ')'; // keeps dotsContainer in current slide position: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the front of the gallery
        arrowContainer.style.left = 'calc(700px * ' + clickedIndex + ')'; // keeps arrows in current slide position: need to move it in the opposite direction and same increment that the slide moved, to offset it otherwise being attached to the front of the gallery
        arrowContainer.style.top = 'calc(' + clickedSideSlide.firstElementChild.offsetHeight + 'px + 1.024rem)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    }


    // --------------------------------------------------------------------------------
    // MOVE CAPTION VISIBILITY TO CLICKED SLIDE
    
    var currentCaption = currentSlide.firstElementChild.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    
    // first check if it is a caption (slides without captions will have a different element in that specified DOM ^^^ position)
    if (currentCaption.hasAttribute('data-galleryfigcaption')) {
         currentCaption.style.display = "none";
    }

    var clickedSlideCaption = clickedSideSlide.firstElementChild.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    
    if (clickedSlideCaption.hasAttribute('data-galleryfigcaption')) {
        clickedSlideCaption.style.display = "block";
    }

    // if the selected slide has a caption & the screen is less than 1225px wide
    if ((clickedSlideCaption.hasAttribute('data-galleryfigcaption')) && (screenWidth < 1225)) {
        // if there is a caption, set this as the placeholder box's height (just the height of the <figure> element)
        placeholderBox.style.height = 'calc(' + clickedSideSlide.firstElementChild.offsetHeight + 'px)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!           
    } else {
        placeholderBox.style.height = 'calc(1.072rem + ' + clickedSideSlide.firstElementChild.offsetHeight + 'px)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!              
    }

    // position dots container so it is between caption and img (for less than 1225, but still works perfectly for 1225+ also!)
    dotsContainer.style.top = 'calc(-' + (placeholderBox.offsetHeight - clickedSideSlide.firstElementChild.firstElementChild.offsetHeight) + 'px + 1.536rem)'; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

    // pass current slide attributes to clicked slide, and vice versa, for identification
    currentSlide.firstElementChild.firstElementChild.setAttribute('class', 'contentimage'); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    clickedSideSlide.firstElementChild.firstElementChild.setAttribute('class', 'contentimage clickme'); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    currentSlide.removeAttribute('id');
    clickedSideSlide.setAttribute('id', galleryName + '-current');
    currentSlide.setAttribute('data-sideslide', '');
    clickedSideSlide.removeAttribute('data-sideslide');
}    // close advanceOrRetreat function





// ******************************************************************************************************************************************
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// when click on an arrow in regular view, sets up and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
function clickGalleryArrow(e) {

    var clickedThing = e.target;

    if (clickedThing.getAttribute('class') == ('galleryarrows yellowhover')) {

        var dotsContainer = clickedThing.parentNode.parentNode.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var gallery = clickedThing.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var galleryName = gallery.getAttribute('id');
        var currentSlide = document.getElementById(galleryName + '-current');

        // get total number of slides in gallery; subtract 3 to prevent counting arrowContainer, dotsContainer, and placeholderBox
        var slideCount = gallery.children.length - 3; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION (e.g. may need to be "- 4" instead) !!!
        
        if (clickedThing.hasAttribute('data-advancearrow')) {

            // if current slide is not the last slide
            // (slideCount - 1) because the index starts at 0, not 1, so need to subtract 1 from count to match them up
            if (currentSlide.getAttribute('data-slide-index') != (slideCount - 1)) {

                // id'ing the next slide
                var clickedSideSlide = currentSlide.nextElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } else {    // implied that advance arrow was clicked when last slide was current

                // id'ing the first slide
                var clickedSideSlide = currentSlide.parentNode.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } // closing inner if/else statement

        } else {    // implied that retreat arrow was clicked

            // if current slide is not the first slide
            if (currentSlide.getAttribute('data-slide-index') != 0) {

                // id'ing previous slide
                var clickedSideSlide = currentSlide.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } else {    // implied that retreat arrow was clicked when first slide was current

                // id'ing the last slide
                var clickedSideSlide = currentSlide.parentNode.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling;
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } // closing inner if/else statement

        } // closing semi-outer if/else statement
    }
}

// EVENT LISTENER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to click in regular view on a left or right arrow
window.addEventListener('click', clickGalleryArrow, false);




// ******************************************************************************************************************************************
// INVOKED + CREATED AT THE SAME TIME -------------------------------------------------------------------------------------------------------
// sets up and responds to swiping L or R, in both regular view and lightbox, and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
window.onload = function() {

    document.addEventListener('swiped-left', function(e) {
        console.log(e.type);
        console.log(e.target);

        var swipedThing = e.target;

        // REG VIEW LEFT SWIPE
        if ((swipedThing.getAttribute('id') == ('galleryimage')) && (swipedThing.classList.contains('clickme'))) {
            
            var dotsContainer = swipedThing.parentNode.parentNode.parentNode.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var gallery = swipedThing.parentNode.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var galleryName = gallery.getAttribute('id');
            var currentSlide = document.getElementById(galleryName + '-current');

            // get total number of slides in gallery; subtract 3 to prevent counting arrowContainer, dotsContainer, and placeholderBox
            var slideCount = gallery.children.length - 3; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION (e.g. may need to be "- 4" instead) !!!

            // if current slide is not the last slide
            // (slideCount - 1) because the index starts at 0, not 1, so need to subtract 1 from count to match them up
            if (currentSlide.getAttribute('data-slide-index') != (slideCount - 1)) {

                // id'ing the next slide
                var clickedSideSlide = currentSlide.nextElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } else {    // implied that advance arrow was clicked when last slide was current

                // id'ing the first slide
                var clickedSideSlide = currentSlide.parentNode.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } // closing inner if/else statement

        } // close if FOR REG VIEW LEFT SWIPE


        // LIGHTBOX LEFT SWIPE
        if (swipedThing.classList.contains('lightboximage')) {

            // declare vars for advanceOrRetreat function
            // mine data-* attribute from last dot right before arrows to get current gallery's name
            var galleryName = swipedThing.parentNode.parentNode.parentNode.parentNode.getAttribute('id'); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var gallery = swipedThing.parentNode.parentNode.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var dotsContainer = gallery.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var currentSlide = document.getElementById(galleryName + '-current');
        
            var currentCaptionDuringLightbox = currentSlide.firstElementChild.lastElementChild.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        
            // find the current slide's index
            var currentIndex = currentSlide.getAttribute('data-slide-index');

            // if the reg view current slide has a caption
            if (currentCaptionDuringLightbox.hasAttribute('data-galleryfigcaption')) {
                currentCaptionDuringLightbox.style.display = "none";
            }

            // all functionality for building lightbox upon lightbox arrow click
            var dotsLightboxContainer = swipedThing.parentNode.lastElementChild.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

            // get total number of slides in gallery; subtract 3 to prevent counting arrowContainer, dotsContainer, and placeholderBox
            var slideCount = gallery.children.length - 3;

            var currentLightbox = document.getElementById('singlelightbox');

            // if current img is not the last one in gallery
            // (slideCount - 1) because the index starts at 0, not 1, so need to subtract 1 from count to match them up
            if (currentSlide.getAttribute('data-slide-index') != (slideCount - 1)) {

                // id'ing the next slide
                var clickedSideSlide = currentSlide.nextElementSibling;
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                // define imgToShow for NAMED functions called within the following nested if-statements
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } else {    // implied that advance arrow was clicked when last slide was current

                // id'ing the first slide
                var clickedSideSlide = currentSlide.parentNode.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } // closing inner if/else statement

        } // close if

    }); // close swiped-left inner function



    // respond to right-swipe
    document.addEventListener('swiped-right', function(e) {
        console.log(e.type);
        console.log(e.target);

        var swipedThing = e.target;

        // REG VIEW RIGHT SWIPE
        if ((e.target.getAttribute('id') == ('galleryimage')) && (e.target.classList.contains('clickme'))) {
            
            var dotsContainer = swipedThing.parentNode.parentNode.parentNode.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var gallery = swipedThing.parentNode.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var galleryName = gallery.getAttribute('id');
            var currentSlide = document.getElementById(galleryName + '-current');

            // if current slide is not the first slide
            if (currentSlide.getAttribute('data-slide-index') != 0) {

                // id'ing previous slide
                var clickedSideSlide = currentSlide.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } else {    // implied that retreat arrow was clicked when first slide was current

                // id'ing the last slide
                var clickedSideSlide = currentSlide.parentNode.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling;
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

            } // closing inner if/else statement

        } // close if FOR REG VIEW RIGHT SWIPE


        // LIGHTBOX RIGHT SWIPE
        if (swipedThing.classList.contains('lightboximage')) {

            // declare vars for advanceOrRetreat function
            // mine data-* attribute from last dot right before arrows to get current gallery's name
            var galleryName = swipedThing.parentNode.parentNode.parentNode.parentNode.getAttribute('id'); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var gallery = swipedThing.parentNode.parentNode.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var dotsContainer = gallery.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            var currentSlide = document.getElementById(galleryName + '-current');
        
            var currentCaptionDuringLightbox = currentSlide.firstElementChild.lastElementChild.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        
            // find the current slide's index
            var currentIndex = currentSlide.getAttribute('data-slide-index');

            // if the reg view current slide has a caption
            if (currentCaptionDuringLightbox.hasAttribute('data-galleryfigcaption')) {
                currentCaptionDuringLightbox.style.display = "none";
            }

            // all functionality for building lightbox upon lightbox arrow click
            var dotsLightboxContainer = swipedThing.parentNode.lastElementChild.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

            // get total number of slides in gallery; subtract 3 to prevent counting arrowContainer, dotsContainer, and placeholderBox
            var slideCount = gallery.children.length - 3; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION (e.g. may need to be "- 4" instead) !!!

            var currentLightbox = document.getElementById('singlelightbox');

            // if current slide is not the first slide
            if (currentSlide.getAttribute('data-slide-index') != 0) {

                // id'ing previous slide
                var clickedSideSlide = currentSlide.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // var clickedIndex = -1;
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } else {    // implied that retreat arrow was clicked when first slide was current

                // id'ing the last slide
                var clickedSideSlide = currentSlide.parentNode.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } // closing inner if/else statement

        } // close if

    }); // close swiped-RIGHT inner function
} // close overall swipe reg. view function





// ******************************************************************************************************************************************     
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// for clicking on sideslides in regular view, moves the gallery accordingly; sets up and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
function selectOtherSlide(e) {  

    var clickedThing = e.target;
    
    // <li> element, if clickedThing was a side slide's <img>
    var clickedThingGrandparent = clickedThing.parentNode.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

    if (clickedThingGrandparent.hasAttribute('data-sideslide')) {

        var imgToShow = clickedThing;

        // declare variables needed for named function
        var clickedSideSlide = clickedThingGrandparent;
        var dotsContainer = clickedSideSlide.parentNode.lastElementChild;// !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var gallery = clickedSideSlide.parentNode;// !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
        var galleryName = gallery.getAttribute('id');
        var currentSlide = document.getElementById(galleryName + '-current');

        // calls NAMED FUNCTION
        advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);

    }    // close if
}    // close function

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++       
// responds to click in regular view on a slide slide
window.addEventListener('click', selectOtherSlide, false);





// ******************************************************************************************************************************************     
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// makes the regular view dots advance/retreat the regular view slideshow; sets up and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
function clickDot(e) {
    var clickedThing = e.target;
    var clickedThingParent = clickedThing.parentNode;// !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    var clickedThingGrandparent = clickedThingParent.parentNode;// !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

    // if the clicked element is a dot that is not the current dot
    if (clickedThingGrandparent.getAttribute('id') == 'regviewdotcontainer') {

        // var clickedDot = clickedThing;
        var clickedDot = clickedThingParent;

        // declare vars for advanceOrRetreat function
        var dotsContainer = clickedThingGrandparent;
        var gallery = dotsContainer.parentNode;// !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var clickedIndex = clickedDot.getAttribute('data-dot-index');
        var galleryName = gallery.getAttribute('id');
        var currentSlide = document.getElementById(galleryName + '-current');
        
        // for loop to be able to define clickedSideSlide, based on currentDotIndex
        for (l = 0; l < dotsContainer.children.length; l++) {

            // find slide with matching index to current dot
            if (clickedDot.getAttribute('data-dot-index') == gallery.children[l].getAttribute('data-slide-index')) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var clickedSideSlide = gallery.children[l]; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

                // calling NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);        

            }  // close if
        }  // close l

        // set newly clicked dot to filled
        clickedDot.setAttribute('class', 'dot')
        // clickedDot.innerHTML = '<img src="https://curiositycoloredglasses.com/assets/images/dot-filled.svg" alt="go to this slide" class="dotimg">';
    }  // close if
} // close function

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++       
// responds to click on a regular-view dot (not a lightbox dot)
window.addEventListener('click', clickDot, false);





// ******************************************************************************************************************************************     
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// makes lightbox dots advance/retreat the regular view slideshow beneath them + creates and populates lightbox for slide corresponding to clicked dot; sets up and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
function lightboxDots(e) {

    var clickedThing = e.target;
    var clickedThingParent = clickedThing.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
    var clickedThingGrandparent = clickedThingParent.parentNode; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

    if (clickedThingGrandparent.getAttribute('id') == 'lightboxdotcontainer') {

        var clickedLightboxDot = clickedThingParent;

        // declare vars for advanceOrRetreat function
        // mine data-* attribute from dot to get current gallery's name
        var galleryName = clickedLightboxDot.getAttribute('data-galleryname');
        var gallery = document.getElementById(galleryName);
        var dotsContainer = gallery.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var clickedIndex = clickedLightboxDot.getAttribute('data-dot-index');
        var currentSlide = document.getElementById(galleryName + '-current');

        
        var currentCaptionDuringLightbox = currentSlide.firstElementChild.lastElementChild.previousElementSibling;
        
        // find the current slide's index
        var currentIndex = currentSlide.getAttribute('data-slide-index');

        // if the reg view current slide has a caption && if the clicked dot is NOT the current dot, hide the caption
        if (currentCaptionDuringLightbox.hasAttribute('data-galleryfigcaption')
            && (clickedIndex != currentIndex)) {
            currentCaptionDuringLightbox.style.display = "none";
        }

        // for loop to be able to define clickedSideSlide, based on currentDotIndex
        for (l = 0; l < dotsContainer.children.length; l++) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
            
            // find slide with matching index to current dot
            if (clickedIndex == gallery.children[l].getAttribute('data-slide-index')) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                
                var clickedSideSlide = gallery.children[l]; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

                // calling NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);        

            }  // close if
        }  // close l

        // all functionality for building lightbox upon lightbox dot click
        var dotsLightboxContainer = clickedThingGrandparent;
        
        // for loop to be able to define imgToShow, based on clickedLightboxDot
        for (m = 0; m < dotsLightboxContainer.children.length; m++) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

            // find slide with matching index to current dot
            if (gallery.children[m].getAttribute('data-slide-index') == clickedLightboxDot.getAttribute('data-dot-index')) { // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                var imgToShow = gallery.children[m].firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

                // remove current lightbox
                var currentLightbox = document.getElementById('singlelightbox');
                currentLightbox.parentNode.removeChild(currentLightbox); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

                // call NAMED lightbox function
                lightbox(imgToShow);  

                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow);               

            }  // close if
        }  // close m
    } // close if
} // close function

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++       
// responds to clicks on lightbox dots
window.addEventListener('click', lightboxDots, false);





// ******************************************************************************************************************************************     
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// makes lightbox arrows advance/retreat the regular view slideshow beneath them + creates and populates lightbox for slide corresponding to clicked arrow; sets up and calls function advanceOrRetreat(...) as a CALLBACK FUNCTION
function lightboxArrows(e) {

    var clickedThing = e.target;

    if (clickedThing.getAttribute('class') == ('galleryarrows lightboxarrows yellowhover')) {

        var clickedLightboxArrow = clickedThing;

        // declare vars for advanceOrRetreat function
        // mine data-* attribute from last dot right before arrows to get current gallery's name
        var galleryName = clickedLightboxArrow.parentNode.previousElementSibling.firstElementChild.getAttribute('data-galleryname'); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var gallery = document.getElementById(galleryName);
        var dotsContainer = gallery.lastElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var currentSlide = document.getElementById(galleryName + '-current');
        
        var currentCaptionDuringLightbox = currentSlide.firstElementChild.lastElementChild.previousElementSibling;
        
        // find the current slide's index
        var currentIndex = currentSlide.getAttribute('data-slide-index');

        // if the reg view current slide has a caption
        if (currentCaptionDuringLightbox.hasAttribute('data-galleryfigcaption')) {
            currentCaptionDuringLightbox.style.display = "none";
        }

        // all functionality for building lightbox upon lightbox arrow click
        var dotsLightboxContainer = clickedThing.parentNode.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!

        // get total number of slides in gallery; subtract 3 to prevent counting arrowContainer, dotsContainer, and placeholderBox
        var slideCount = gallery.children.length - 3; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION (e.g. may need to be "- 4" instead) !!!

        var currentLightbox = document.getElementById('singlelightbox');

        if (clickedThing.hasAttribute('data-advancelightboxarrow')) {

            // if current img is not the last one in gallery
            // (slideCount - 1) because the index starts at 0, not 1, so need to subtract 1 from count to match them up
            if (currentSlide.getAttribute('data-slide-index') != (slideCount - 1)) {

                // id'ing the next slide
                var clickedSideSlide = currentSlide.nextElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                // define imgToShow for NAMED functions called within the following nested if-statements
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } else {    // implied that advance arrow was clicked when last slide was current

                // id'ing the first slide
                var clickedSideSlide = currentSlide.parentNode.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // var clickedIndex = -(slideCount - 1);
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox); // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } // closing inner if/else statement

        } else {    // implied that retreat arrow was clicked

            // if current slide is not the first slide
            if (currentSlide.getAttribute('data-slide-index') != 0) {

                // id'ing previous slide
                var clickedSideSlide = currentSlide.previousElementSibling;
                // var clickedIndex = -1;
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } else {    // implied that retreat arrow was clicked when first slide was current

                // id'ing the last slide
                var clickedSideSlide = currentSlide.parentNode.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // var clickedIndex = (slideCount - 1);
                var clickedIndex = clickedSideSlide.getAttribute('data-slide-index');
                // calls NAMED FUNCTION
                advanceOrRetreat(clickedSideSlide, dotsContainer, gallery, clickedIndex, galleryName, currentSlide);
                var imgToShow = clickedSideSlide.firstElementChild.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
                // remove current lightbox
                currentLightbox.parentNode.removeChild(currentLightbox);
                // call NAMED lightbox function
                lightbox(imgToShow);  
                // call NAMED function to populate lightbox dots (defined in lightbox.js)
                populateLightboxDots(imgToShow); 

            } // closing inner if/else statement
        } // closing semi-outer if/else statement
    } // close if
} // close function

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// responds to clicks on lightbox arrows
window.addEventListener('click', lightboxArrows, false);






// ******************************************************************************************************************************************     
// INVOKED EARLIER VIA CALLBACK (on click of an img to open lightbox) + VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION (used on resize) ---------------------------------------------------------------------------
function verticallyCenter() {
    var singleLightbox = document.getElementById('singlelightbox');
    if (singleLightbox) {
        var lightboxImg = singleLightbox.firstElementChild; // !!! FULLSCREEN BUTTON MAY AFFECT THIS DOM NAVIGATION !!!
        var imgHeight = lightboxImg.offsetHeight;
        singleLightbox.style.height = (window.innerHeight);
        singleLightbox.style.width = window.innerWidth;
        var lightboxHeight = singleLightbox.offsetHeight;
        lightboxImg.style.marginTop = (lightboxHeight - imgHeight)/2 + 'px';
    }
}

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// vertically centers lightbox img upon screen resize
window.addEventListener('resize', verticallyCenter, false);





// ******************************************************************************************************************************************     
// INVOKED VIA EVENT LISTENER IMMEDIATELY FOLLOWING THIS FUNCTION ---------------------------------------------------------------------------
// reloads page upon device orientation change, forcing it to run through all the above (and other called) functions so that gallery images load in the correct sizes
function lightboxSlideshowResize() {

    // this will reload the page as it is resized, and will keep its relative height the same; reloading the page will force it to run through all the existing (above) functions, so it will be resetting placeholderBox height, dotsContainer location, etc as resizing happens
    location.reload();

}

// EVENT LISTENER +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// runs upon device orientation change
window.addEventListener('orientationchange', lightboxSlideshowResize, false);




















