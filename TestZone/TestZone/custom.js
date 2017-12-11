var settingsLeft = {
            toggle: "#sliiider-toggle-menu", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
            exit_selector: ".slider-exit-coursecontent", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
            animation_duration: "0.5s", //how long it takes to slide the menu
            place: "left", //where is the menu sliding from, possible options are (left | right | top | bottom)
            animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
            body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
            no_scroll: false, //set to true if you want the scrolling disabled while the menu is active
                auto_close: false //set to true if you want the slider to auto close everytime a child link of it is clicked
                };

var settingsRight = {
            toggle: "#sliiider-toggle-right", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
            exit_selector: ".slider-exit-coursecontent", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
            animation_duration: "0.5s", //how long it takes to slide the menu
            place: "right", //where is the menu sliding from, possible options are (left | right | top | bottom)
            animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
            body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
            no_scroll: false, //set to true if you want the scrolling disabled while the menu is active
                auto_close: false //set to true if you want the slider to auto close everytime a child link of it is clicked
                };
//$(document).ready(()=>{
//    var menu1 = $('#menu').sliiide(settingsLeft);
//    var menu2 = $('#menu-right').sliiide(settingsRight);
//    
//    setTimeout(()=>{
//        console.log('timeout execute');
//        menu1.reset();
//        menu2.reset();
//        
//        setTimeout(()=>{
//            var menu1 = $('#menu').sliiide(settingsLeft);
//            var menu2 = $('#menu-right').sliiide(settingsRight);
//        },5000);
//    },5000);
//    
//    
//});


$(document).ready(()=>{
    var enoughtime = true;
    var menu1 = null;
    $(window).resize(()=>{
        console.log(enoughtime);
        if(!enoughtime)
            return;
        if($(window).width() < 500){
            if(menu1==null){
                enoughtime = false;
                menu1 = $('#menu').sliiide(settingsLeft);
                setTimeout(()=>{
                    enoughtime=true;
                },200);
            }
        }
        else{
            console.log('reset');
            if(menu1!=null){
                enoughtime = false;
//                console.log('reset');
                menu1.reset();
                setTimeout(()=>{
                    menu1=null;
                    enoughtime=true;
                },700);
            }
        }
    });
});