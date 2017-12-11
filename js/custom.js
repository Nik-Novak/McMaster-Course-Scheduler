//////////////////////////////////////
//---------Niks Nonesense
//////////////////////////////////////

//2676 courses
loader.onLoad(() => {
    setup();
    console.log(loader.getCourseById(1318));
    parseSearch(loader.getCourseById(1318));
});

//////////////////////////////////////
//-------Niks Nonesense
//////////////////////////////////////

var grid = new Array(28);
for (var i = 0; i < 28; i++) {
    grid[i] = new Array(7);
}

window.fullGrid = grid;

function setup() {
    window.objectList = [];
    window.coresList = [];
    window.labsList = [];
    window.tutorialsList = [];
    window.allConflicts = [];
    window.numConflictIDs = 0;
    window.conflictNumResolved = null;

}


//render();

window.viewMode = "locked";
window.currentSearch = "none";

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

}

/*
 ** Takes in a number (value) and precision (step)
 */
function round(value, step) {
    step || step(1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}



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
        is_clickable: true,
        conflict: false, 
        conflict_id: null
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

        //console.log(loc[i][0] + " " + loc[i][1]);

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
            //            if ((viewMode === "locked" && courseObject.is_selected === true) || (viewMode === "options")) {
            //                //                if (cnt2 == 0) {
            //                //                    fullGrid[locations[cnt1][0]][day] = {
            //                //                        courseObject: courseObject,
            //                //                        classNum: cnt1
            //                //                    };
            //                //                } else {
            //                //                    fullGrid[locations[cnt1][0] + cnt2][day] = "-";
            //                //                }
            //                updateGrid(cnt1, cnt2, day, courseObject, locations);
            //
            //            }
            updateGrid(cnt1, cnt2, day, courseObject, locations);


        }
    }
    
    //console.log("POST MESH");
    //console.log(fullGrid);
    
    
    
}

//function updateGrid(outer, inner, day, courseObject, locations) {
//    if (viewMode === "options") {
//        
//        if (inner == 0) {
//            fullGrid[locations[outer][0]][day] = {
//                courseObject: courseObject,
//                classNum: outer
//            };
//        } 
//        else {
//            fullGrid[locations[outer][0] + inner][day] = "-";
//        }
//    } 
//    else if (viewMode === "locked") {
//        
//        if (courseObject.is_selected === true) {
//            if (inner == 0) {
//                fullGrid[locations[outer][0]][day] = {
//                    courseObject: courseObject,
//                    classNum: outer
//                };
//            } 
//            else {
//                fullGrid[locations[outer][0] + inner][day] = "-";
//            }
//
//        } 
//        else {
//            if (inner == 0) {
//                fullGrid[locations[outer][0]][day] = undefined;
//            } 
//            else {
//                fullGrid[locations[outer][0] + inner][day] = undefined;
//            }
//        }
//
//    }
//
//}

function LinkedList(){
    this.head = null;
}

LinkedList.prototype.push = function(val){
    var node = {
       value: val,
       next: null
    }
    if(!this.head){
      this.head = node;      
    }
    else{
      current = this.head;
      while(current.next){
        current = current.next;
      }
      current.next = node;
    }
}



function deleteKthFromEnd(sll, k){
   var node = sll.head,
       i = 1,
       kthNode,
       previous;
   if(k<=0) return sll;

    while(node){
      if(i == k) kthNode = sll.head;
      else if(i-k>0){
       previous = kthNode;
       kthNode = kthNode.next;
      }
      i++;

      node = node.next;
    }
    //kth node is the head
    if(!previous)
       sll.head = sll.head.next;
    else{
     previous.next = kthNode.next;
   }
   return sll;
}

function kthFromEnd(sll, k){
   var node = sll.head,
       i = 1,
       kthNode;
   //handle, 0 or negative value of k
   if(k<=0) return;

    while(node){
      if(i == k) kthNode = sll.head;
      else if(i-k>0){
       kthNode = kthNode.next;
      }
      i++;

      node = node.next;
    }
   return kthNode;
}





//LinkedList.prototype.length = function () {
//
//    var position = this.head;
//    var length = 0;
//    while(position !== null){
//        position = position.next;
//        length++;
//    }
//    return length;
//    
//}

var c93892 = new LinkedList();
c93892.push(1);
c93892.push(2);
c93892.push(3);
deleteKthFromEnd(c93892, 1);
c93892.push(4);
console.log(kthFromEnd(c93892, 1));



console.log(c93892.head);
console.log(c93892.head.next);
console.log(c93892.head.next.next);
console.log(c93892.head.next.next.next);
console.log(linkedListLength(c93892));

function linkedListLength(LinkedList){
    var position = LinkedList.head;
    var length = 0;
    while(position !== null){
        position = position.next;
        length++;
    }
    return length;
}

function printSLL() {
    for (var i = 0; i < allConflicts.length; i++) {
        var tempArr = [];
        var index = allConflicts[i].head;
//        console.log(index.value.courseObject.section);
        console.log("#Conflicting Courses... " + linkedListLength(allConflicts[i]));
//        console.log(linkedListLength(allConflicts[i]));
       
        var lengthj = linkedListLength(allConflicts[i]);
        for (var j = 0; j < lengthj; j++) {            
        
            if(j < (lengthj-1)){
                var print1 = index.value.courseObject.progCode + " " + index.value.courseObject.section;
                console.log(print1);
                
            }
            else{
                var print2 = index.value.progCode + " " + index.value.section;
                console.log(print2);
            }
            
//            console.log("i: " + i + " j: " + j);
//            console.log(index.value);
            index = index.next;
        }
        console.log("");
    }
}



function conflictManager(time, day, oldCourse, newCourse) {
    if (oldCourse === "-")
        alert("Dashed line");
    else {
        //if course hasn't conflicted yet create new linked list
        if(oldCourse.courseObject.conflict === false){
            var tempSLL = new LinkedList();
            tempSLL.push(oldCourse);
            tempSLL.push(newCourse);
            allConflicts.push(tempSLL);
//            console.log("NEW Conflict.......");

//            console.log(allConflicts[0].head.value.courseObject.section);
//            console.log(allConflicts[0].head.next.value.section);
            oldCourse.courseObject.conflict = true;
            newCourse.conflict = true;
            oldCourse.courseObject.conflict_id = numConflictIDs;
            newCourse.conflict_id = numConflictIDs; 
            
            numConflictIDs++;
        
            
        }
        else{
            
            newCourse.conflict = true;
            //console.log(oldCourse.courseObject);
            for(var i = 0; i < allConflicts.length; i++){
                //console.log(kthFromEnd(allConflicts[i], 1).value);
                if(kthFromEnd(allConflicts[i], 1).value === oldCourse.courseObject){
                    //alert(kthFromEnd(allConflicts[i], 1).value.section +"  same as " + oldCourse.courseObject.section);
                    
                    var tempID = kthFromEnd(allConflicts[i], 1).value.conflict_id;
                    deleteKthFromEnd(allConflicts[i], 1);
                    
                    oldCourse.courseObject.conflict_id = tempID;
                    newCourse.conflict_id = tempID; 
                    allConflicts[i].push(oldCourse);
                    allConflicts[i].push(newCourse);
                }
            }
//            console.log("OLD Conflict.......");
//            console.log(oldCourse.courseObject.section);
        }
//        var old1 = oldCourse.hasOwnProperty("classNum");
//        var new1 = newCourse.hasOwnProperty("classNum");

//        console.log("Conflict at....");
//        console.log(time + "  " + day);
//        console.log("Between");
//        console.log(oldCourse.courseObject.section);
//        console.log(newCourse.section);
//        console.log(old1 + "  " + new1);
//        console.log("");

    }

}

function updateGrid(outer, inner, day, courseObject, locations) {
    if (viewMode === "search") {

        if (inner == 0) {

            if (fullGrid[locations[outer][0]][day] !== undefined) {

                conflictManager(locations[outer][0], day, fullGrid[locations[outer][0]][day], courseObject);
            }
            fullGrid[locations[outer][0]][day] = {
                courseObject: courseObject,
                classNum: outer
            };
        } else {
            fullGrid[locations[outer][0] + inner][day] = "-";
        }
    } else if (viewMode === "locked") {
        console.log("WTFhgfhgf?");

        if (courseObject.is_selected === true) {
            console.log(courseObject.section);
            if (inner == 0) {
                fullGrid[locations[outer][0]][day] = {
                    courseObject: courseObject,
                    classNum: outer
                };
                console.log(fullGrid[locations[outer][0]][day]);
            } else {
                fullGrid[locations[outer][0] + inner][day] = "-";
                console.log(fullGrid[locations[outer][0] + inner][day]);
            }

        } else if (((typeof (fullGrid[locations[outer][0]][day])) === "object")) {
            //            if (inner == 0) {
            //                fullGrid[locations[outer][0]][day] = undefined;
            //            } else {
            //                fullGrid[locations[outer][0] + inner][day] = undefined;
            //            }
            //do nothing!
            if(fullGrid[locations[outer][0]][day].courseObject.is_selected === true){
                //do nothing!
                //fullGrid[locations[outer][0]][day] = undefined;
            }
            else{
                fullGrid[locations[outer][0]][day] = undefined;
            }
            
            
        } else if (fullGrid[locations[outer][0] + inner][day] === "-") {
            console.log("Made it to --------");
            var index = locations[outer][0] + inner; 
            console.log(typeof (fullGrid[index][day]));
            while(fullGrid[index][day] !== undefined){
                if(fullGrid[index][day] === undefined){
                    alert("WTF IS GOING ON");
                }
                console.log(fullGrid[index][day]);
                index = index - 1;      
            }
            if (fullGrid[index][day]===undefined){
                fullGrid[locations[outer][0] + inner][day] = undefined;
            }
            else if (fullGrid[index][day].courseObject.is_selected === true) {
                //fullGrid[locations[outer][0] + inner][day] = undefined;
            } else {
                fullGrid[locations[outer][0] + inner][day] = undefined;
            }
            

        }

    } else if (viewMode === "options") {}

}



function generateTentativeView(courseType) {
    var courseTypeList;
    if (courseType === "C") {
        courseTypeList = coresList;
        currentSearch = "C";
        currentSearchList = coresList;
    } else if (courseType === "L") {
        courseTypeList = labsList;
        currentSearch = "L";
        currentSearchList = labsList;
    } else if (courseType === "T") {
        courseTypeList = tutorialsList;
        currentSearch = "T";
        currentSearchList = tutorialsList;
    } else {
        alert("Course Type Invalid");
    }


    //alert("we made it");
    for (var i = 0; i < courseTypeList.length; i++) {
        meshGrid(courseTypeList[i]);
    }
    render();
}


function render() {
    //alert("first render");
    //printSLL();
    var insert = "<td><span></span><br><span></span></td>";
    var none = "<td style='display:none;'><span></span><br><span></span></td>";

    var masterRenderList = new Array(28);
    for (var cnt = 0; cnt < 28; cnt++) {
        masterRenderList[cnt] = new Array(7);
    }
    console.log(fullGrid);
    for (var i = fullGrid.length - 1; i >= 0; i--) {

        var tempTransferList = [];

        for (var j = fullGrid[i].length - 1; j >= 0; j--) {

            //            console.log("Type= " + typeof(fullGrid[i][j]));

            //                console.log("i: "+ i + "j: " + j +"     " + fullGrid[i][j]);

            
            if ((typeof(fullGrid[i][j]) === "object")) {
                //console.log(fullGrid[i][j].courseObject.is_selected);
                if (fullGrid[i][j].courseObject.conflict && (fullGrid[i][j].courseObject.is_selected===false)) {
                    //console.log("True " + fullGrid[i][j].courseObject.conflict + " i: " + i + " j:" + j);
                    var formatted1 = formatInnerConflict(fullGrid[i][j]);
                    tempTransferList.unshift(formatted1);
                } else {
                    //console.log("False " + fullGrid[i][j].courseObject.conflict + " i: " + i + " j:" + j);
                    var formatted2 = formatNoConflict(fullGrid[i][j]);
                    tempTransferList.unshift(formatted2);
                }
                
                

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
        }
    }


    //console.log(fullGrid);

}

function formatNoConflict(objWithClassNum) {
    var code = objWithClassNum.courseObject.code;
    var section = objWithClassNum.courseObject.section;
    var classNum = objWithClassNum.classNum;

    var numBlocks = quikmafs(objWithClassNum.courseObject)[classNum];

    var room = objWithClassNum.courseObject.r_periodsArr[classNum][1];
    var cInsertion = "<td id='" + objWithClassNum.courseObject.serial + "' class='tentativeBox' rowspan='" + numBlocks + "'><span>" + code + "-" + section + "</span><br><span>" + room + "</span></td>";


    //        console.log(cInsertion);
    return cInsertion;
}
function formatInnerConflict(objWithClassNum) {
    var code = objWithClassNum.courseObject.code;
    var section = objWithClassNum.courseObject.section;
    var classNum = objWithClassNum.classNum;

    var numBlocks = quikmafs(objWithClassNum.courseObject)[classNum];

    var room = objWithClassNum.courseObject.r_periodsArr[classNum][1];
    
    //        console.log(cInsertion);
    
//    var innerConflictsList = [];
    for (var i = 0; i < allConflicts.length; i++) {
        if (kthFromEnd(allConflicts[i], 1).value === objWithClassNum.courseObject) {
            //alert(kthFromEnd(allConflicts[i], 1).value.section + "  same as " + objWithClassNum.courseObject.section);
            deleteKthFromEnd(allConflicts[i], 1);
            allConflicts[i].push(objWithClassNum);
            
//            var numConflicts = linkedListLength(allConflicts[i]);
//            index = allConflicts[i].head;
//            
//            for(var j = 0; j < numConflicts; j++){
//                innerConflictsList.push(index);
//                //var print1 = index.value.courseObject.progCode + " " + index.value.courseObject.section;
//                //console.log(print1);
//                index = index.next;
//            }
//            
            
        }
    }
    
//    for(var k = 0; k < innerConflictsList.length; k++){
//    
//        console.log(innerConflictsList[k]);
//        //$("#practice tbody tr" + k).append(masterRenderList[k][m]);
//        
//    }
    
    
    var cInsertion = "<td id='temp" + objWithClassNum.courseObject.serial + "' class='innerConflictBox' rowspan='" + numBlocks + "'><span>Multiple Options</span><br><span>Select</span></td>";


    
    

    return cInsertion;
}




function formatConflict(objWithClassNum){
    
    
}








//$("#calendar table tbody tr td").on(click, dynamicChild, function() {});

$(document).on("click", "#calendar table tbody tr td", function (e) {

    var id = $(this).attr('id');
    var className = $(this).attr('class');
//    alert(id + "  " + className);
    

    //    var courseTypeList;
    //    
    //    if (currentSearch === "C")
    //        courseTypeList = coresList;       
    //    else if (currentSearch === "L")
    //        courseTypeList = labsList;
    //    else if (currentSearch === "T")
    //        courseTypeList = tutorialsList;



    if (className === "innerConflictBox") {
        //alert("innerCOnflictzzzz");
   alert("Showing options at page bottom ");
        for (var i = 0; i < allConflicts.length; i++) {
            //alert("CHeck 0 : " + kthFromEnd(allConflicts[i], 1).value);
            //console.log("HEllooooo " + i);
            //console.log("temp"+kthFromEnd(allConflicts[i], 1).value.courseObject.serial);
            var optionID = "temp"+kthFromEnd(allConflicts[i], 1).value.courseObject.serial
            if (optionID === id) {
                //alert("CHeck 1");
                //alert(kthFromEnd(allConflicts[i], 1).value.section + "  same as " + objWithClassNum.courseObject.section);
//                deleteKthFromEnd(allConflicts[i], 1);
//                allConflicts[i].push(objWithClassNum);

                var numConflicts = linkedListLength(allConflicts[i]);
                index = allConflicts[i].head;
                //console.log(index);
                for (var j = 0; j < numConflicts; j++) {
                    //alert("CHeck 2");
//                    innerConflictsList.push(index);
                    //var print1 = index.value.courseObject.progCode + " " + index.value.courseObject.section;
                    //console.log(print1);
                    var numBlocks = quikmafs(index.value.courseObject)[index.value.classNum];
                    var code = index.value.courseObject.code;
                    var section = index.value.courseObject.section;
                    var room = index.value.courseObject.r_periodsArr[index.value.classNum][1];
                    var cInsertion = "<td id='" + index.value.courseObject.serial + "' class='tentativeBox' rowspan='" + numBlocks + "'><span>" + code + "-" + section + "</span><br><span>" + room + "</span></td>";
                    $("#practice tbody tr").append(cInsertion);
                    index = index.next;
                }
            }
        }
        
        
        
        
        
    }
    else {
        for (var i = 0; i < currentSearchList.length; i++) {
            if (currentSearchList[i].serial === id && currentSearchList[i].is_selected === false) {
                console.log("id match: ORIGINAL");
                currentSearchList[i].is_selected = true;
                viewMode = "locked";
            } else if (currentSearchList[i].serial === id && currentSearchList[i].is_selected === true) {
                console.log("id match: EDIT");
                currentSearchList[i].is_selected = false;
                viewMode = "search";
            }

        }
        //console.log(viewMode);
        generateTentativeView(currentSearch);
    }
    


    //console.log(fullGrid);
    //generateTentativeView(currentSearch);
    //console.log(fullGrid);


    //console.log(id);


});



$(document).on("click", "#practice table tbody tr td", function (e) {

    var id = $(this).attr('id');
    var className = $(this).attr('class');
//    alert("Enroll? " + id + "  " + className);
    alert("Enroll? ");

    //    var courseTypeList;
    //    
    //    if (currentSearch === "C")
    //        courseTypeList = coresList;       
    //    else if (currentSearch === "L")
    //        courseTypeList = labsList;
    //    else if (currentSearch === "T")
    //        courseTypeList = tutorialsList;



//    if (className === "innerConflictBox") {
//        alert("innerCOnflictzzzz");
//   
//        for (var i = 0; i < allConflicts.length; i++) {
//            //alert("CHeck 0 : " + kthFromEnd(allConflicts[i], 1).value);
//            console.log("HEllooooo " + i);
//            console.log("temp"+kthFromEnd(allConflicts[i], 1).value.courseObject.serial);
//            var optionID = "temp"+kthFromEnd(allConflicts[i], 1).value.courseObject.serial
//            if (optionID === id) {
//                alert("CHeck 1");
//                //alert(kthFromEnd(allConflicts[i], 1).value.section + "  same as " + objWithClassNum.courseObject.section);
////                deleteKthFromEnd(allConflicts[i], 1);
////                allConflicts[i].push(objWithClassNum);
//
//                var numConflicts = linkedListLength(allConflicts[i]);
//                index = allConflicts[i].head;
//                console.log(index);
//                for (var j = 0; j < numConflicts; j++) {
//                    alert("CHeck 2");
////                    innerConflictsList.push(index);
//                    //var print1 = index.value.courseObject.progCode + " " + index.value.courseObject.section;
//                    //console.log(print1);
//                    var numBlocks = quikmafs(index.value.courseObject)[index.value.classNum];
//                    var code = index.value.courseObject.code;
//                    var section = index.value.courseObject.section;
//                    var room = index.value.courseObject.r_periodsArr[index.value.classNum][1];
//                    var cInsertion = "<td id='" + index.value.courseObject.serial + "' class='tentativeBox' rowspan='" + numBlocks + "'><span>" + code + "-" + section + "</span><br><span>" + room + "</span></td>";
//                    $("#practice tbody tr").append(cInsertion);
//                    index = index.next;
//                }
//            }
//        }
//        
//        
//        
//        
//        
//    }
        console.log(currentSearchList);
        for (var i = 0; i < currentSearchList.length; i++) {
            if (currentSearchList[i].serial === id && currentSearchList[i].is_selected === false) {
                console.log("id match: ORIGINAL");
                console.log(currentSearchList[i]);
                currentSearchList[i].is_selected = true;
                viewMode = "locked";
            } else if (currentSearchList[i].serial === id && currentSearchList[i].is_selected === true) {
                console.log("id match: EDIT");
                currentSearchList[i].is_selected = false;
                viewMode = "search";
            }

        }
        console.log(fullGrid);
        generateTentativeView(currentSearch);
    
    

});


$(".cores").click(function () {
    viewMode = "search";
    generateTentativeView("C");
})

$(".labs").click(function () {
    viewMode = "search";
    generateTentativeView("L");
})

$(".tutorials").click(function () {
    viewMode = "search";
    generateTentativeView("T");
})









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

// Toggle Hamburger Buttons


$( "#sliiider-toggle-menu" ).click(function() {
  $( "#sliiider-toggle-menu" ).toggleClass( "is-active" ),
  $( ".buttonTextL" ).toggleClass( "hide" )
});

$( "#sliiider-toggle-coursecontent" ).click(function() {
  $( "#sliiider-toggle-coursecontent" ).toggleClass( "is-active" ),
  $( ".buttonTextR" ).toggleClass( "hide" )
});



$(".remWeekend").click(function () {
    //    var tableDisplay = $('.sun').css('display');
    //    if (tableDisplay === "table-cell") {
    //        $(".sun").css("display", "none");T
    //        $(".sat").css("display", "none");
    //        $(".th-sun").css("display", "none");
    //        $(".th-sat").css("display", "none");
    //    } else {
    //        $(".sun").css("display", "table-cell");
    //        $(".sat").css("display", "table-cell");
    //        $(".th-sun").css("display", "table-cell");
    //        $(".th-sat").css("display", "table-cell");
    //    }
    setup();
    var course = Math.floor(Math.random() * 2000);
    console.log("Course: " + course)
    parseSearch(loader.getCourseById(course));
    console.log(loader.getCourseById(course));

})


//
//$(".cores").balloon();
//$(".cores").balloon({
//  tipSize: 24,
//  css: {
//    border: 'solid 4px #5baec0',
//    padding: '10px',
//    fontSize: '150%',
//    fontWeight: 'bold',
//    lineHeight: '3',
//    backgroundColor: '#666',
//    color: '#fff'
//  }
//});

//$(function() {
//  $('.cores').balloon({
//  tipSize: 24,
//  css: {
//    border: 'solid 4px #5baec0',
//    padding: '10px',
//    fontSize: '150%',
//    fontWeight: 'bold',
//    lineHeight: '3',
//    backgroundColor: '#666',
//    color: '#fff'
//  }
//});
//});







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




