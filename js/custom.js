//////////////////////////////////////
//---------Niks Nonesense
//////////////////////////////////////

//2676 courses
var dummy = {};
$.getJSON("data/databank.json", function (json) {
    var courses = convertKeysToArray(json.timetables[2017][6].courses);
    sortResults(courses, 'department', true);
    dummy = courses[373];

    console.log(dummy);
    mClass(dummy);

});

function searchFor(courses) {
    var empty = [];
    courses.forEach((e) => {
        if (e.sections.C != null && e.sections.C != undefined && e.sections.C.C01 != null && e.sections.C.C01.r_periods != null)
            e.sections.C.C01.r_periods.forEach((f) => {
                if (f.day == 6)
                    empty.push(e);
            });
    });
    //console.log(empty);
}

function sortResults(array, prop, asc) {
    if (prop == 'code')
        return array.sort(function (a, b) {
            if (asc) {
                return (a[prop].split(' ')[1] > b[prop].split(' ')[1]) ? 1 : ((a[prop].split(' ')[1] < b[prop].split(' ')[1]) ? -1 : 0);
            } else {
                return (b[prop].split(' ')[1] > a[prop].split(' ')[1]) ? 1 : ((b[prop].split(' ')[1] < a[prop].split(' ')[1]) ? -1 : 0);
            }
        });
    else
        return array.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
}

function convertKeysToArray(json) {
    var array = [];
    $.each(json, function (key, value) {
        array.push(value);
    });
    return array;
}

function test() {
    //console.log();
}


test();

//////////////////////////////////////
//-------Niks Nonesense
//////////////////////////////////////


var objectList = [];

function mClass(searchObject) {

    this.progCode = searchObject.code;
    this.code = this.progCode.split(" ")[1]; //grabbing just course code
    this.department = searchObject.department;
    this.name = searchObject.name;


    for (var i in searchObject.sections) {
        if (!searchObject.sections.hasOwnProperty(i))
            continue;

        this.type = i;
        for (var j in searchObject.sections[i]) {
            if (!searchObject.sections[i].hasOwnProperty(j))
                continue;


            this.section = j;
            this.r_periods = searchObject.sections[i][j].r_periods;
            this.serial = searchObject.sections[i][j].serial;
            this.section_full = searchObject.sections[i][j].section_full;

            //initialize r_periods double array
            r_periodsArr = new Array(r_periods.length);
            for (var cnt = 0; cnt < r_periods.length; cnt++) {
                r_periodsArr[cnt] = new Array(6);
            }

            //populating r_periods douvle array
            for (var k = 0; k < r_periods.length; k++) {
                r_periodsArr[k][0] = r_periods[k].end;
                r_periodsArr[k][1] = r_periods[k].room;
                r_periodsArr[k][2] = r_periods[k].term;
                r_periodsArr[k][3] = r_periods[k].start;
                r_periodsArr[k][4] = r_periods[k].day;
                r_periodsArr[k][5] = r_periods[k].supervisors;
            }

            this.r_periodsArr = r_periodsArr;
            var tempObj = new build(this.progCode, this.code, this.department, this.name, this.type, this.section, this.r_periodsArr, this.serial, this.section_full);
            objectList.push(tempObj);


            //             For testing purposes
            //                        for (var t1 = 0; t1 < this.r_periods.length; t1++) {
            //                            for (var t2 = 0; t2 < 5; t2++) {
            //                                console.log(this.r_periodsArr[t1][t2]);
            //            
            //                            }
            //                        }
            //            
            //                        console.log(
            //                            "Type: " + this.type +
            //                            "\nSection: " + this.section +
            //                            "\nr_periods: " + this.r_periodsArr[0][1] +
            //                            "\nserial: " + this.serial +
            //                            "\nsection_full: " + this.section_full
            //                        );


        }


    }

//    console.log(objectList[0]);
//    console.log(objectList[1]);
//    console.log(objectList[2]);
//    console.log(objectList[3]);
//    console.log(objectList[4]);
//    console.log(objectList[5]);
//    console.log(objectList[6]);
    quikmafs(objectList[0]);

}

function round(value, step){
    step || step(1.0);
    var inv =1.0 / step;
    return Math.round(value * inv) /inv;
}

function quikmafs(courseObj){
    
    var courseLengths =[];
    
    for(var i=0; i<courseObj.r_periodsArr.length; i++){
        var startHour = courseObj.r_periodsArr[i][3].split(":")[0];
        var startMin = courseObj.r_periodsArr[i][3].split(":")[1];
        var endHour = courseObj.r_periodsArr[i][0].split(":")[0];
        var endMin = courseObj.r_periodsArr[i][0].split(":")[1];
        
        
        var lenHour = (endHour - startHour)*60;
        var lenMin = (parseInt(endMin/10) - parseInt(startMin/10))*10;
        
        var cLength = round((lenHour + lenMin)/60, .5);
        
        var numBlocks = cLength*2;
        
        courseLengths.push(numBlocks);
        
        
    }
    return courseLengths;
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
        section_full: section_full
    }
}

var grid = new Array(14);
for (var i = 0; i < 14; i++) {
    grid[i] = new Array(7);
}


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
