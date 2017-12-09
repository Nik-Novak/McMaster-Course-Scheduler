var database = firebase.database();

$(document).ready(() => {
    
//    getData('/courses',(snapshot)=>{
//        console.log(snapshot.val()); //print whoel database
//    });
//    
//    getData('departments',(e)=>{
//        var departments = e.val();
//        console.log(departments);
//    });
    
    loadDepartments();
    loadProfs();
    loadCourses();
    
//    populateBrowseProgram();
    
});


function loadCourses(){
    onData('/course_department',(e)=>{  console.warn('Courses by Department Successfully Loaded.'); window.course_department = e.val(); checkLoad(); populateBrowseProgram('SFWRENG'); }); //VIEW ALL COURSES
        onData('/course_name',(e)=>{  console.warn('Courses by Name Successfully Loaded.'); window.course_name = e.val();  checkLoad(); }); //VIEW ALL COURSES
        onData('/course_code',(e)=>{  console.warn('Courses by Code Successfully Loaded.'); window.course_code = e.val();  checkLoad(); }); //VIEW ALL COURSES
}

function loadProfs(){
    onData('/professors',(e)=>{  console.warn('Professors  Successfully Loaded.'); window.professors = e.val();  }); //VIEW ALL COURSES
}
window.course_code
function loadDepartments(){
    onData('departments',(e)=>{
        var departments = e.val();
        var def = $('<option value="-">Select Department</option>');
        $('.select-department').html('');
        $('.select-department').append(def);
        for (var key in departments){
            if(!departments.hasOwnProperty(key))
                continue;
            var t = $('<option value="'+key+'">'+departments[key]+'</option>');
            $('.select-department').append(t);
        }
        console.warn('Departments Successfully Loaded.');
        console.log(departments);
    });
}

function populateBrowseProgram(program){
    
    $('.select-department').change(function(){
        alert(this.value);
        var dep = this.value.toString();
        console.log(dep);
        var index = binSearch(window.course_department, dep,'department');
        if(index!=-1){
            $('#unicornsdontexist').html('');
            extractAll(window.course_department,index, dep, 'department').forEach((course)=>{
                $('#unicornsdontexist').append($('<p>'+course.code+'</p>'));
            });
        }
    });
    
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
    console.log('wtf: ' + low + ' - ' + mid + ' - ' + high);
    while(low < mid && high > mid){
        console.log('iter: ' + low + ' - ' + mid + ' - ' + high);
        console.log(program);
        console.log(array[mid]);
        
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
            console.log(array[mid]);
            return mid;
        }
    }
    console.error('not found');
    return -1;
}

function extractAll(array, index, program, prop){
    var reclist = [];
    reclist.push(array[index]);
    console.error(prop);
    return extractAllRec(array, index, program, prop, reclist, index-1, index+1);
}

function extractAllRec(array, index, program, prop, reclist, reclow, rechigh){
    
    var lowresult = (array[reclow][prop]==program);
    var highresult = (array[rechigh][prop]==program);
    if(!lowresult && !highresult)
        return reclist;
    else if(!lowresult){
        reclist.push(array[rechigh]);
        return extractAllRec(array,index,program,prop,reclist,reclow,rechigh+1);
    }
    else if (!highresult){
        reclist.unshift(array[reclow]);
        return extractAllRec(array,index,program,prop,reclist,reclow-1,rechigh);
    }
    else{
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

function checkLoad(){
    if(window.course_code!=null && window.course_name!=null && window.course_department!=null && window.professors!=null){
        $('#menu .loading-span').css('display', 'none');
    }
}