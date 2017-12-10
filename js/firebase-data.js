var database = firebase.database();
var load = true;


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
            $('#unicornsdontexist').append($('<p>' + loader.getCourseById(courseid).code + '</p>'));
        });
    });
    
    $('#quicksearch').on('input',function(){
        $('#unicornsdontexist').html('');
        this.value.split(' ').forEach((word)=>{
            console.log('search: ' + word + ' result:');
            if(loader.searchindex[word]!=null)
                loader.searchindex[word].forEach((result)=>{
                    if(result.type!='id')
                        return;
                    var courseid = result.indexedkey;
                    $('#unicornsdontexist').append($('<p>' + loader.getCourseById(courseid).code + '</p>'));
                });
            console.log(loader.searchindex[word]);
        });
    });
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

