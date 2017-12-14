var database = firebase.database();
var load = true;
var test = new Set();
Set.prototype.intersect = function intersect(...sets) {
    if (!sets.length) return new Set();
    const i = sets.reduce((m, s, i) => s.size < sets[m].size ? i : m, 0);
    const [smallest] = sets.splice(i, 1);
    const res = new Set();
    for (let val of smallest)
        if (sets.every(s => s.has(val)))
             res.add(val);
    return res;
}
Set.prototype.diff = function(other){
    return new Set([...this].filter(x => !other.has(x)));
}

Set.prototype.union = function(other){
    return new Set([...this, ...other]);
}

var loader = {
    init: function(){
        $(document).ready(() => {
            if(!load)
                return;
            loadDepartments();
            loadCourses();
            loadIndexes();
            this.onLoad(()=>{initializeMenu();});
            
        });
    },
    
    onLoad: function(callback){
        if(this.loadqueue==null)
            this.loadqueue = [];
        this.loadqueue.push(callback);
    },
    
    checkLoad: function (){
        if(loader.courses!=null && loader.departments!=null && loader.coursecodes!=null && loader.searchindex!=null){
            $('#menu .loading-span').css('display', 'none');
            if(this.loadqueue!=null)
                this.loadqueue.forEach((callback)=>{
                    callback();
                }); 
        }
    },
    getCourseById: function(id){
        return this.courses[id];
    },
    getCourseIDsByCode: function(code){
        return this.coursecodes[code];
    },
    getCoursesByDepartment: function(department){
        if(loader.departments[department]==null)
            return;
        let list = [];
        loader.departments[department].courses.forEach((courseid)=>{
            list.push(this.getCourseById(courseid));
        });
        return list;
    },
    getCourseIDsByDepartment: function(department){
        var courseids = loader.departments[department];
        if (courseids!=null)
            return courseids.courses;
    },
    
    parseTerm: function(course){
        switch(course.term){
            case 2:
                return 1;
            case 5:
                return 2;
            default:
                return 'unknown';
        }
    }
    
} 

loader.init();

function initializeMenu() {
    var departments = loader.departments;
    var def = $('<option value="-">Select Department</option>');
    $('.select-department').html('');
    $('.select-department').append(def);
    for (var key in departments) {
        if (!departments.hasOwnProperty(key))
            continue;
        var t = $('<option value="' + key + '">' + departments[key].name + '</option>');
        $('.select-department').append(t);
    }

    $('.select-department').change(function () {
        $('#unicornsdontexist').html('');
        var dep = this.value.toString();
        if (dep == '-')
            return;
        departments[dep].courses.forEach((courseid) => {
            //$('#unicornsdontexist').append($('<p>' + loader.getCourseById(courseid).code + '</p>'));
            
//            $('#unicornsdontexist').append($('<p>' + loader.getCourseById(courseid).code + '</p>'));
            
            
            
            
            /*
            <tr class="header">
                                        <td>SFWRENG 4H03</td>
                                        <td><i class="fa fa-square" aria-hidden="true"></i></td>
                                        <td><i class="fa fa-caret-down" aria-hidden="true"></i></td>
                                    </tr>
                                        <tr class = "subTable">
                                            <td>CORE</td>
                                            <td><i class="fa fa-circle" aria-hidden="true"></i></td>
                                            <td><button class="enrollButton">ADD</button></td>
                                        </tr>

                                        <tr class = "subTable details">
                                            <td>Instructor:</td>
                                            <td colspan="2">Staff</td>
                                        </tr>

                                        <tr class = "subTable">
                                            <td>LAB</td>
                                            <td><i class="fa fa-square" aria-hidden="true"></i></td>
                                            <td><button class="enrollButton">ADD</button></td>
                                        </tr>
                                        <tr class = "subTable">
                                            <td>Tutorial</td>
                                            <td><i class="fa fa-play" aria-hidden="true"></i></td>
                                            <td><button class="enrollButton">ADD</button></td>
                                        </tr>  
            */
            
        });
    });
    
    $('#quicksearch').on('input',function(){
        var coderesults = new Set();
        var depresults = new Set();
        var nameresults = new Set();
        var instructresults = new Set();
        $('#search-table').html('');
        this.value.split(' ').forEach((word)=>{
            console.log('search: ' + word + ' result:');
            
            word=word.toUpperCase();
            //course code
            if(/[0-9][A-Za-z][A-Za-z0-9][0-9]/.test(word,'i')){
                wordtrim = word.match(/[0-9][A-Za-z][A-Za-z0-9][0-9]/)[0].toUpperCase();
                if(wordtrim.toString().charAt(2)=='O')
                    wordtrim = wordtrim.substr(0,2) + '0' + wordtrim.substr(3);
                loader.getCourseIDsByCode(wordtrim).forEach((courseid)=>{
                    coderesults.add(courseid);
                });
                return;
            }
            
            //department
            if(word.length<=8 && word.length>=2){
                var courses = loader.getCourseIDsByDepartment(word);
                if(courses!=null)
                    courses.forEach((courseid)=>{
                        depresults.add(courseid);
                    });
            }
            
            word=word.toLowerCase();
            
            //searchindex
            if(loader.searchindex[word]!=null)
                loader.searchindex[word].forEach((result)=>{
                    if(result.type=='name')
                        nameresults.add(result.indexedkey);//nameresults.add(loader.getCourseById(result.indexedkey));
                    else if(result.type=='department')
                        loader.getCourseIDsByDepartment(result.indexedkey).forEach((courseid)=>{
                             depresults.add(courseid);
                        });
                       //loader.getCoursesByDepartment(result.indexedkey).forEach((course)=>{ depresults.add(course); });
                    else if (result.type=='instructor')
                        instructresults.add(result.indexedkey);//instructresults.add(loader.getCourseById(result.indexedkey));
//                    var courseid = result.indexedkey;
//                    $('#unicornsdontexist').append($('<p>' + loader.getCourseById(courseid).code + '</p>'));
                });
        });
        var results = {};
        console.log(' ');
        console.log('Code Results:');
        console.log(coderesults);
        coderesults.forEach((courseid)=>{
            results[courseid] = {weight:10};
        });
        console.log('Department Results:');
        console.log(depresults);
        depresults.forEach((courseid)=>{
            if(results[courseid]==null)
                results[courseid] = {weight:3};
            else
                results[courseid].weight+=3;
        });
        console.log('Name Results:');
        console.log(nameresults);
        nameresults.forEach((courseid)=>{
            if(results[courseid]==null)
                results[courseid] = {weight:5};
            else
                results[courseid].weight+=5;
        });
        console.log('Instructor Results:');
        console.log(instructresults);
        instructresults.forEach((courseid)=>{
            if(results[courseid]==null)
                results[courseid] = {weight:2};
            else
                results[courseid].weight+=2;
        });
        console.log('Ranked Results');
        console.log(results);
        
        console.log('Union results:');
        var union = depresults.union(nameresults).union(instructresults).union(coderesults);
        console.log(union);
        
        var resultsarray = $.map(results, function(value, index) {
            return [{courseid:index, weight:value.weight}];
        });
        
        resultsarray.sort(function (a, b) {
                return (a['weight'] < b['weight']) ? 1 : ((a['weight'] > b['weight']) ? -1 : 0);
        });
        
        console.log('results array');
        console.log(resultsarray);
        
        resultsarray.forEach((result)=>{
            
//            $('#unicornsdontexist').append($('<p>' + loader.getCourseById(result.courseid).code + /*'  --id:  '+ result.courseid + ' --weight: ' + result.weight+*/ '</p>'));
            var course = loader.getCourseById(result.courseid);
            $('#search-table').append( $(createResultTable(course)) );
            $('.header').off();
            $('#qs-form .header').click(function () {
                $(this).nextUntil('tr.header').slideToggle(0.1);
                $('#qs-form .header').not(this).nextUntil('tr.header').slideUp(0.1);
                
            });
        
        });
    });
}

function createResultTable(course){
            var final =             '<tr class="header">' + 
                                        '<td>'+course.code+'</td>' + 
                                        '<td>'+loader.parseTerm(course)+'</i></td>' +
                                        '<td><i class="fa fa-caret-down" aria-hidden="true"></i></td>' +
                                    '</tr>';
    
    /*
    +
                                        '<tr class = "subTable">' +
                                            '<td>CORE</td>' +
                                            '<td><i class="fa fa-circle" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>' +

                                        '<tr class = "subTable details">' +
                                            '<td>Instructor:</td>' +
                                            '<td colspan="2">Staff</td>' +
                                        '</tr>' +

                                        '<tr class = "subTable">' +
                                            '<td>LAB</td>' +
                                            '<td><i class="fa fa-square" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>' +
                                        '<tr class = "subTable">' +
                                            '<td>Tutorial</td>' +
                                            '<td><i class="fa fa-play" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>'
    */
    
            if(course.sections.C !=null){
                final+='<tr class = "subTable">' +
                                            '<td>CORE</td>' +
                                            '<td><i class="fa fa-circle" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>' +

                                        '<tr class = "subTable details">' +
                                            '<td>Instructor:</td>' +
                                            '<td colspan="2">Staff</td>' +
                                        '</tr>';
            }
    
            if(course.sections.L !=null){
                final += '<tr class = "subTable">' +
                                            '<td>LAB</td>' +
                                            '<td><i class="fa fa-square" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>';
            }
            if(course.sections.T !=null){
                final += '<tr class = "subTable">' +
                                            '<td>Tutorial</td>' +
                                            '<td><i class="fa fa-play" aria-hidden="true"></i></td>' +
                                            '<td><button class="enrollButton">ADD</button></td>' +
                                        '</tr>';
            }
    return final;
}

function loadDepartments(){
        onData('department_courseid',(e)=>{
            loader.departments = e.val();
            console.warn('Departments Successfully Loaded.');
            loader.checkLoad();
        });
}

function loadCourses(){
    onData('/courses',(e)=>{  console.warn('Courses Successfully Loaded.'); loader.courses = e.val(); loader.checkLoad();}); //VIEW ALL COURSES
    onData('/coursecode_courseid',(e)=>{  console.warn('Course Codes Successfully Loaded.'); loader.coursecodes = e.val(); loader.checkLoad();}); //VIEW ALL COURSES
}

function loadIndexes(){
    onData('/searchindex',(e)=>{  console.warn('Search Index Successfully Loaded.'); loader.searchindex = e.val(); loader.checkLoad();}); //VIEW ALL COURSES
}

//$(document).ready(() => {
//    
//    if(!load)
//        return;
//    
////    getData('/courses',(snapshot)=>{
////        console.log(snapshot.val()); //print whoel database
////    });
////    
////    getData('departments',(e)=>{
////        var departments = e.val();
////        console.log(departments);
////    });
//    
//    loadDepartments();
//    loadProfs();
//    loadCourses();
//    
//    $('.select-department').change(function(){
//        var dep = this.value.toString();
////        console.log(dep);
//        var index = binSearch(window.course_department, dep,'department');
//        $('#unicornsdontexist').html('');
//        if(index!=-1){
//            extractAll(window.course_department,index, dep, 'department').forEach((course)=>{
//                $('#unicornsdontexist').append( $('<p>'+course.code+'</p>') );
//            });
//            
//        }
//    });
//    
////    populateBrowseProgram();
//    
//});

function debugPrintCourses(start, end){
    console.log('begin sweep from ' +start + " to " + end);
    for (var i=start; i<=end; i++)
        console.log(window.course_department[i]);
}

//function loadCourses(){
//    onData('/course_department',(e)=>{  console.warn('Courses by Department Successfully Loaded.'); window.course_department = e.val(); checkLoad(); populateBrowseProgram('ENGINEER'); }); //VIEW ALL COURSES
//        onData('/course_name',(e)=>{  console.warn('Courses by Name Successfully Loaded.'); window.course_name = e.val();  checkLoad(); }); //VIEW ALL COURSES
//        onData('/course_code',(e)=>{  console.warn('Courses by Code Successfully Loaded.'); window.course_code = e.val();  checkLoad(); }); //VIEW ALL COURSES
//}

function loadProfs(){
    onData('/professors',(e)=>{  console.warn('Professors  Successfully Loaded.'); window.professors = e.val();  }); //VIEW ALL COURSES
}

function populateBrowseProgram(program){
    
    var index = binSearch(window.course_department, program,'department');
    if(index!=-1){
        $('#butterytests').html('');
        extractAll(window.course_department,index, program, 'department').forEach((course)=>{
            $('#butterytests').append($('<p>'+course.code+'</p>'));
        });
    }
    
}

function binSearch(array,program,prop){
    var low=0, high=array.length-1;
    var mid = parseInt(high/2);
//    console.log('wtf: ' + low + ' - ' + mid + ' - ' + high);
    while(low < mid && high > mid){
//        console.log('iter: ' + low + ' - ' + mid + ' - ' + high);
//        console.log(program);
//        console.log(array[mid]);
        
    if(program < array[mid][prop]){
        high = mid;
        mid= parseInt((high-low)/2 + low);
    }
        else if (program > array[mid][prop]){
            low = mid;
            mid=parseInt((high-low)/2+low);
        }
        else{
            console.log('found! at index: ' + mid);
//            console.log(array[mid]);
            return mid;
        }
    }
    console.error('department not found');
    return -1;
}

function extractAll(array, index, program, prop){
    var reclist = [];
    reclist.push(array[index]);
    return extractAllRec(array, index, program, prop, reclist, index-1, index+1);
}

function extractAllRec(array, index, program, prop, reclist, reclow, rechigh){
    console.log('IterRec: '+ reclow + ' - ' + index + ' - ' + rechigh);
    var lowresult = reclow>0 && (array[reclow][prop]==program);
    var highresult = (rechigh<array.length-1) && (array[rechigh][prop]==program);
    
    if(!lowresult && !highresult){
        console.log('Extract Results: '+ reclow + ' - ' + index + ' - ' + rechigh);
        return reclist;
    }
    else if(!lowresult){
        reclist.push(array[rechigh]);
        return extractAllRec(array,index,program,prop,reclist,reclow,rechigh+1);
    }
    else if (!highresult){
        reclist.unshift(array[reclow]);
        return extractAllRec(array,index,program,prop,reclist,reclow-1,rechigh);
    }
    else{
        reclist.unshift(array[reclow]);
        reclist.push(array[rechigh]);
        return extractAllRec(array,index,program,prop,reclist,reclow-1,rechigh+1);
    }
//        extractAll(array, index, program, prop, reclist, reclow, rechigh);
}

function getData(path, callback) {
    return firebase.database().ref(path).once('value').then(callback);
}

function onData(path, callback) {
    return firebase.database().ref(path).on('value',callback);
}

//TEST ZONE


var settingsLeft = {
            toggle: "#sliiider-toggle-menu", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
            exit_selector: ".slider-exit-menu", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
            animation_duration: "0.5s", //how long it takes to slide the menu
            place: "left", //where is the menu sliding from, possible options are (left | right | top | bottom)
            animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
            body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
            no_scroll: false, //set to true if you want the scrolling disabled while the menu is active
                auto_close: false //set to true if you want the slider to auto close everytime a child link of it is clicked
                };

var settingsRight = {
            toggle: "#sliiider-toggle-coursecontent", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
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
//    var menu2 = $('#coursecontent').sliiide(settingsRight);
//});

$(document).ready(()=>{
    var enoughtime = true;
    var menu1 = $('#menu').sliiide(settingsLeft);
    var menu2 = null;
    if($(window).width() < 780)
        menu2 = $('#coursecontent').sliiide(settingsRight);
    $(window).resize(()=>{
        console.log(enoughtime);
        if(!enoughtime)
            return;
        if($(window).width() < 780){
            if(menu2==null){
                enoughtime = false;
                
                menu2 = $('#coursecontent').sliiide(settingsRight);
                setTimeout(()=>{
                    enoughtime=true;
                },200);
            }
            if(menu1==null){
                enoughtime = false;
                menu1 = $('#menu').sliiide(settingsLeft);
                setTimeout(()=>{
                    enoughtime=true;
                },200);
            }
        }
        else if($(window).width() > 1700){
            if(menu1!=null){
                enoughtime = false;
//                console.log('reset');
                
                menu1.reset();
                setTimeout(()=>{
                    
                    menu1=null;
                    enoughtime=true;
                },700);
            }
            
            if(menu2!=null){
                enoughtime = false;
//                console.log('reset');
                
                menu2.reset();
                setTimeout(()=>{
                    
                    menu2=null;
                    enoughtime=true;
                },700);
            }
        }
        else if($(window).width() <= 1700 && $(window).width() >= 780){
            if(menu1==null){
                enoughtime = false;
                menu1 = $('#menu').sliiide(settingsLeft);
                setTimeout(()=>{
                    enoughtime=true;
                },200);
            }
            
            if(menu2!=null){
                enoughtime = false;
//                console.log('reset');
                
                menu2.reset();
                setTimeout(()=>{
                    
                    menu2=null;
                    enoughtime=true;
                },700);
            }
        }
        else{
            console.log('reset');
            if(menu2!=null){
                enoughtime = false;
//                console.log('reset');
                
                menu2.reset();
                setTimeout(()=>{
                    
                    menu2=null;
                    enoughtime=true;
                },700);
            }
        }
    });
    
    $(window).resize();
});