//var settingsRight = {
//            toggle: "#sliiider-toggle-menu", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
//            exit_selector: ".slider-exit-coursecontent", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
//            animation_duration: "0.5s", //how long it takes to slide the menu
//            place: "left", //where is the menu sliding from, possible options are (left | right | top | bottom)
//            animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
//            body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
//            no_scroll: false, //set to true if you want the scrolling disabled while the menu is active
//                auto_close: false //set to true if you want the slider to auto close everytime a child link of it is clicked
//                };
//$(document).ready(()=>{
//    var menu = sliideMenu = $('#menu').sliiide(settingsRight);
//});



  $('#test').balloon({
  tipSize: 24,
  css: {
    border: 'solid 4px #5baec0',
    padding: '10px',
    fontSize: '150%',
    fontWeight: 'bold',
    lineHeight: '3',
    backgroundColor: '#666',
    color: '#fff'
  },
      contents:$('<img src="img/smiley.jpg" alt="failed to laod"><div style="display:block; margin:0 auto;" ><input type="text" place-holder="Search for a course"><button>Search</button></div>'),//contents:'<img src="img/smiley.jpg" alt="failed to laod">',
      html:true
});

  $('#cook').balloon({
  tipSize: 24,
  css: {
    border: 'solid 4px #5baec0',
    padding: '10px',
    fontSize: '150%',
    fontWeight: 'bold',
    lineHeight: '3',
    backgroundColor: '#666',
    color: '#fff'
  },
      contents:$('<img src="img/gas.jpg" alt="failed to laod">'),//contents:'<img src="img/smiley.jpg" alt="failed to laod">',
      html:true
});
