jQuery(window).load(function () {
    jQuery("#preloader").delay(100).fadeOut("slow");
    jQuery("#load").delay(100).fadeOut("slow");
});


// toggle screen
$(".screenswitch").click(function () {
    var screen = $('#coursecontent').css('display');
    if (screen === "inline-block") {
        $("#coursecontent").css("display", "none");
        $("#menu").css("display", "inline-block");
        //        $("#coursecontent").animate({width:'toggle'},350);
    } else {
        $("#coursecontent").css("display", "inline-block");
        $("#menu").css("display", "none");
    }
})

$(".remWeekend").click(function () {
    var tableDisplay = $('.sun').css('display');
    if (tableDisplay === "table-cell") {
        $(".sun").css("display", "none");
        $(".sat").css("display", "none");
    } else {
        $(".sun").css("display", "table-cell");
        $(".sat").css("display", "table-cell");
    }
})

// accordion collapse
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}





function dayChange(dayNum) {
    var dayClass;
    switch (dayNum) {
        case 1:
            dayClass = ".mon";
            break;
        case 2:
            dayClass = ".tues";
            break;
        case 3:
            dayClass = ".wed";
            break;
        case 4:
            dayClass = ".thur";
            break;
        case 5:
            dayClass = ".fri";
            break;
        default:
            dayClass = ".sat";
    }
    return dayClass;
}


function startTimeConvert(start) {
    var startTimeClass;
    switch (start) {
        case "8:30":
            startTimeClass = ".eightThirtyAM";
            break;
        case "9:30":
            startTimeClass = ".nineThirtyAM";
            break;
        case "10:30":
            startTimeClass = ".tenThirtyAM";
            break;
        case "11:30":
            startTimeClass = ".elevenThirtyAM";
            break;
        case "12:30":
            startTimeClass = ".twelveThirtyPM";
            break;
        case "13:30":
            startTimeClass = ".oneThirtyPM";
            break;
        case "14:30":
            startTimeClass = ".twoThirtyPM";
            break;
        case "15:30":
            startTimeClass = ".threeThirtyPM";
            break;
        case "16:30":
            startTimeClass = ".fourThirtyPM";
            break;
        case "17:30":
            startTimeClass = ".fiveThirtyPM";
            break;
        case "18:30":
            startTimeClass = ".sixThirtyPM";
            break;
        case "19:00":
            startTimeClass = ".sevenPM";
            break;
        case "20:00":
            startTimeClass = ".eightPM";
            break;
        case "21:00":
            startTimeClass = ".ninePM";
            break;
        default:
            startTimeClass = ".";
    }
    return startTimeClass;
}




calInput("hello", "hello", "17:30", "hello", 1);
//input to calendar
function calInput(courseCode, instructor, startTime, endTime, day) {
    var dayClass = dayChange(day);
    var startTimeClass = startTimeConvert(startTime);
    $(startTimeClass + " " + dayClass).css("background-color", "yellow");
}
