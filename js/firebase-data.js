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
    
});


function loadCourses(){
    onData('/course_department',(e)=>{  console.warn('Courses by Department Successfully Loaded.'); window.course_department = e.val(); checkLoad(); }); //VIEW ALL COURSES
        onData('/course_name',(e)=>{  console.warn('Courses by Name Successfully Loaded.'); window.course_name = e.val();  checkLoad(); }); //VIEW ALL COURSES
        onData('/course_code',(e)=>{  console.warn('Courses by Code Successfully Loaded.'); window.course_code = e.val();  checkLoad(); }); //VIEW ALL COURSES
}

function loadProfs(){
    onData('/professors',(e)=>{  console.warn('Professors  Successfully Loaded.'); window.professors = e.val();  }); //VIEW ALL COURSES
}

function loadDepartments(){
    onData('departments',(e)=>{
        var departments = e.val();
        var def = $('<option value="-">Select Department</option>');
        $('.select-department').html('');
        $('.select-department').append(def);
        for (var key in departments){
            if(!departments.hasOwnProperty(key))
                continue;
            var t = $('<option value="'+key+'">'+departments[key]+'</option>')
            $('.select-department').append(t);
        }
        console.warn('Departments Successfully Loaded.');
        console.log(departments);
    });
}

function getData(path, callback) {
    return firebase.database().ref(path).once('value').then(callback);
}

function onData(path, callback) {
    return firebase.database().ref(path).on('value',callback);
}

function checkLoad(){
    if(window.course_code!=null && window.course_name!=null && window.course_department!=null && window.professors!=null){
        alert('fully loaded dawg');
    }
}