//////////////////////////////////////
//---------Niks Nonesense
//////////////////////////////////////

//2676 courses
loader.onLoad(() => {
    parseSearch(loader.getCourseById(906));
});

//////////////////////////////////////
//-------Niks Nonesense
//////////////////////////////////////
var grid = new Array(28);
for (var i = 0; i < 28; i++) {
    grid[i] = new Array(7);
}

window.fullGrid = grid;

var objectList = [];
var coresList = [];
var labsList = [];
var tutorialsList = [];

//render();

window.viewMode = "locked";

function parseSearch(searchObject) {

    this.progCode = searchObject.code; //setting full code -ie SFWRENG 4HC3
    this.code = this.progCode.split(" ")[1]; //setting just course code -ie 4HC3
    this.department = searchObject.department; //setting department -ie SFWRENG
    this.name = searchObject.name; //setting course name -ie Human Computer Interfaces


    //loop that searches for the remainign categories for the course
    for (var i in searchObject.sections) {
        if (!searchObject.sections.hasOwnProperty(i))
            continue;

        this.type = i; //setting type of course 
        for (var j in searchObject.sections[i]) {
            if (!searchObject.sections[i].hasOwnProperty(j))
                continue;


            this.section = j; //setting section -ie C01, L02, T14
            this.r_periods = searchObject.sections[i][j].r_periods; //grabbing r_periods object 
            this.serial = searchObject.sections[i][j].serial; //setting unique 5 digit serial number -ie 11534
            this.section_full = searchObject.sections[i][j].section_full; //setting course status -ie true(course full) or false(course not full)

            //initialize r_periods double array
            r_periodsArr = new Array(r_periods.length);
            for (var cnt = 0; cnt < r_periods.length; cnt++) {
                r_periodsArr[cnt] = new Array(6);
            }

            //populating r_periods double array
            for (var k = 0; k < r_periods.length; k++) {
                r_periodsArr[k][0] = r_periods[k].end; //setting end time for course -ie 12:20
                r_periodsArr[k][1] = r_periods[k].room; //setting room for course -ie MDCL 1105
                r_periodsArr[k][2] = r_periods[k].term; //setting term for course -ie 2(winter term), 5(fall term)
                r_periodsArr[k][3] = r_periods[k].start; //setting end time for course -ie 14:30
                r_periodsArr[k][4] = r_periods[k].day; //setting day for course --> 1 though 6 which is Monday through Saturday
                r_periodsArr[k][5] = r_periods[k].supervisors; //setting class supervisor -ie John Doe (Professor Name)
            }

            this.r_periodsArr = r_periodsArr;
            var tempObj = new build(this.progCode, this.code, this.department, this.name, this.type, this.section, this.r_periodsArr, this.serial, this.section_full);

            if (tempObj.type === "C")
                coresList.push(tempObj);
            else if (tempObj.type === "L")
                labsList.push(tempObj);
            else if (tempObj.type === "T")
                tutorialsList.push(tempObj);
            else
                alert("Object is not a Core, Lab or Tutorial")

            objectList.push(tempObj);

        }


    }

    //    var insert = "<td><span></span><br><span></span></td>";
    //            $("#calendar tbody tr.r0").append(insert);
    //        $("#calendar tbody tr.r1").append(insert);

    //    for (var q = 0; q < tutorialsList.length; q++) {
    ////        if (objectList[q].r_periodsArr[q][0] === undefined || objectList[q].r_periodsArr[q][3] === undefined){
    ////            alert("WARNING: Start or End Time Undefined.");
    ////        }
    ////            
    ////        else {
    ////            var numBlocks = quikmafs(objectList[q]);
    ////            locationMap(objectList[q], numBlocks);
    ////        }
    ////        var numBlocks = quikmafs(objectList[q]);
    ////        locationMap(objectList[q], numBlocks);
    //        
    //        
    //        meshGrid(tutorialsList[q]);
    //
    //
    //    }

    //    generateTentativeView("C");
    generateTentativeView("T");
    //    generateTentativeView("L");



    render();

}

/*
 ** Takes in a number (value) and precision (step)
 */
function round(value, step) {
    step || step(1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}





//searchObject.sections[i][j].r_periods.forEach(() => {
//    for
//})


function build(progCode, code, department, name, type, section, r_periodsArr, serial, section_full) {
    return {
        progCode: progCode,
        code: code,
        department: department,
        name: name,
        type: type,
        section: section,
        r_periodsArr: r_periodsArr,
        serial: serial,
        section_full: section_full,
        is_selected: false,
        is_clickable: true
    }
}

function blocks(endHour, startHour, endMin, startMin) {
    var lenHour = (endHour - startHour) * 60;
    var lenMin = (parseInt(endMin / 10) - parseInt(startMin / 10)) * 10;
    var numBlocks = round((lenHour + lenMin) / 60, .5) * 2;

    return numBlocks;
}

//
function timeToNum(time) {
    var endHour = time.split(":")[0];
    var endMin = time.split(":")[1];
    var startHour = 8;
    var startMin = 0;

    var numBlocks = blocks(endHour, startHour, endMin, startMin);

    return numBlocks;
}

function quikmafs(courseObj) {

    var courseLengths = [];

    for (var i = 0; i < courseObj.r_periodsArr.length; i++) {
        var startHour = courseObj.r_periodsArr[i][3].split(":")[0];
        var startMin = courseObj.r_periodsArr[i][3].split(":")[1];
        var endHour = courseObj.r_periodsArr[i][0].split(":")[0];
        var endMin = courseObj.r_periodsArr[i][0].split(":")[1];

        var numBlocks = blocks(endHour, startHour, endMin, startMin);

        courseLengths.push(numBlocks);
    }
    return courseLengths;
}

function locationMap(courseObject) {
    var numBlocks = quikmafs(courseObject);
    var obj = courseObject;
    var loc = [numBlocks.length];
    for (var y = 0; y < numBlocks.length; y++) {
        loc[y] = new Array(2);
    }

    for (var i = 0; i < numBlocks.length; i++) {

        loc[i][0] = timeToNum(obj.r_periodsArr[i][3]);
        loc[i][1] = numBlocks[i];

        console.log(loc[i][0] + " " + loc[i][1]);

    }
    //    console.log("HELLO: " + loc.length);
    return loc;
}


/*  Populates gloabal grid if possible, will need to include conflicts here  */
function meshGrid(courseObject) {

    var locations = locationMap(courseObject);

    for (var cnt1 = 0; cnt1 < locations.length; cnt1++) {

        var day = (courseObject.r_periodsArr[cnt1][4]) - 1;

        for (var cnt2 = 0; cnt2 < locations[cnt1][1]; cnt2++) {
            //if (viewMode === "options" && courseObject.is_selected === false) {
            if (cnt2 == 0) {
                fullGrid[locations[cnt1][0]][day] = {
                    courseObject: courseObject,
                    classNum: cnt1
                };
            } else {
                fullGrid[locations[cnt1][0] + cnt2][day] = "-";
            }

            //}


        }
    }
}

function generateTentativeView(courseType) {
    var courseTypeList;
    if (courseType === "C")
        courseTypeList = coresList;
    else if (courseType === "L")
        courseTypeList = labsList;
    else if (courseType === "T")
        courseTypeList = tutorialsList;
    else {
        alert("Course Type Invalid");
    }

    viewMode = "options";
    //alert("we made it");
    for (var i = 0; i < courseTypeList.length; i++) {
        meshGrid(courseTypeList[i]);
    }
}


function render() {
    //alert("first render");
    var insert = "<td><span></span><br><span></span></td>";
    var none = "<td style='display:none;'><span></span><br><span></span></td>";

    var masterRenderList = new Array(28);
    for (var cnt = 0; cnt < 28; cnt++) {
        masterRenderList[cnt] = new Array(7);
    }

    for (var i = fullGrid.length - 1; i >= 0; i--) {

        var tempTransferList = [];

        for (var j = fullGrid[i].length - 1; j >= 0; j--) {

            //            console.log("Type= " + typeof(fullGrid[i][j]));

            //                console.log("i: "+ i + "j: " + j +"     " + fullGrid[i][j]);

            if (typeof (fullGrid[i][j]) === "object") {
                var formatted = format(fullGrid[i][j]);
                tempTransferList.unshift(formatted);
            } else if (typeof (fullGrid[i][j]) === "undefined") {
                tempTransferList.unshift(insert);
            } else if (fullGrid[i][j] === "-") {
                tempTransferList.unshift(null);
            } else {
                alert("Not one of object, undefined or string");
            }

        }
        masterRenderList[i] = tempTransferList;
    }


    //removes all td's except the hour td's
    $("#calendar tbody tr td:not(.hour)").remove();



    for (var k = 0; k < fullGrid.length; k++) {
        for (var m = 0; m < fullGrid[k].length; m++) {
            $("#calendar tbody tr.r" + k).append(masterRenderList[k][m]);
            var hasid = $("#calendar tbody tr.r" + k + " td").attr('id');
            console.log(hasid);
        }
    }


    console.log(fullGrid);

}

function format(objWithClassNum) {
    var code = objWithClassNum.courseObject.code;
    var section = objWithClassNum.courseObject.section;
    var classNum = objWithClassNum.classNum;

    var numBlocks = quikmafs(objWithClassNum.courseObject)[classNum];

    var room = objWithClassNum.courseObject.r_periodsArr[classNum][1];
    var cInsertion = "<td id='" + objWithClassNum.courseObject.serial + "' class='tentativeBox' rowspan='" + numBlocks + "'><span>" + code + "-" + section + "</span><br><span>" + room + "</span></td>";


    //        console.log(cInsertion);
    return cInsertion;
}







//$("#calendar table tbody tr td").on(click, dynamicChild, function() {});

$(document).on("click", "#calendar table tbody tr td", function(e){

    var hasid = $(this).attr('id');
    
    console.log(hasid);
    
    
} );







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
        $(".th-sun").css("display", "none");
        $(".th-sat").css("display", "none");
    } else {
        $(".sun").css("display", "table-cell");
        $(".sat").css("display", "table-cell");
        $(".th-sun").css("display", "table-cell");
        $(".th-sat").css("display", "table-cell");
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

// Course listings Table Details collapse 
$('.header').click(function () {
    $(this).nextUntil('tr.header').slideToggle(1);
});



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
            startTimeClass = ".eightThirtyAM";
    }
    return startTimeClass;
}


//grid[0][0] = "hello";
//
//console.log(grid[0][1]);
//console.log(dummy.code);

inputClass("4HC3", "ITB AB102", "hello", "15:30", "hello", 4);
//input to calendar
function inputClass(courseCode, room, instructor, startTime, endTime, day) {
    var dayClass = dayChange(day);
    var startTimeClass = startTimeConvert(startTime);
    $(startTimeClass + " " + dayClass).css("background-color", "yellow");
    $(startTimeClass + " " + dayClass + ' span:eq(0)').text(courseCode);
    $(startTimeClass + " " + dayClass + ' span:eq(1)').text(room);
    //    $(startTimeClass + " " + dayClass).attr('rowspan',3);
}


inputClass("4HC3", "ITB AB102", "hello", "15:30", "hello", 4);

function removeClass(courseCode, room, instructor, startTime, endTime, day) {
    var dayClass = dayChange(day);
    var startTimeClass = startTimeConvert(startTime);
    $(startTimeClass + " " + dayClass).css("background-color", "inherit");
    $(startTimeClass + " " + dayClass + ' span:eq(0)').text("");
    $(startTimeClass + " " + dayClass + ' span:eq(1)').text("");
}
