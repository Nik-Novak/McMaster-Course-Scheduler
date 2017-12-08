var database = firebase.database();
//2676 courses

function uploadToFirebase() {
    $.getJSON("data/databank.json", function (json) {
        console.log('\nOVERWRITING DATABASE CONTENTS WITH NEW DATA\n');
        //    //console.log(json);
        //    console.log(json.timetables[2017][6].courses);//console.log(Object.keys(json.timetables[2017][6].courses).length);
        ////    sortResults();
        //   var courses = convertKeysToArray(json.timetables[2017][6].courses);
        //    sortResults(courses, 'department', true);
        ////    sortResults(courses, 'name', true);
        ////    sortResults(courses, 'department', true);
        ////    sortResults(courses, 'name', false);
        ////    sortResults(courses, 'department', false);
        ////    sortResults(courses, 'code', true);
        ////    searchFor(courses);
        //    dummy = courses[829];
        //    console.log(dummy);

//        removeData('/courses');
//        writeDepartments(json.departments); //DONE
//        writeCoursesByDepartment(json.timetables[2017][6].courses); //DONE
//            writeCoursesByCode(json.timetables[2017][6].courses); //DONE
//        writeCoursesByName(json.timetables[2017][6].courses); //DONE
//            writeProfessors();//DONE
        

        
//        getData('/course_department',(e)=>{  console.log(e.val());  }); //VIEW ALL COURSES

    });
}

function arrayToUnique(array){
    var unique = [];
    $.each(array, function(i, el){
        if($.inArray(el, unique) === -1) unique.push(el);
    });
    return unique;
}

function writeCoursesByDepartment(coursesjson){
    var courses = convertObjectToArray(coursesjson);
    sortResults(courses, 'code', true);
    writeData('/course_department',courses);
}

function writeCoursesByCode(coursesjson){
    var courses = convertObjectToArray(coursesjson);
    sortResults(courses, 'codenumber', true);
    writeData('/course_code',courses);
}

function writeDepartments(departments){
        writeData('/departments',departments);
}

function writeCoursesByName(coursesjson){
    var courses = convertObjectToArray(coursesjson);
    sortResults(courses, 'name', true);
    writeData('/course_name',courses);
}

function writeProfessors(){
    getData('/course_department',(e)=>{
                var list = {};
                e.val().forEach((course)=>{
                    $.each(course.sections, (key1,value1)=>{
                        $.each(value1, (key2,value2)=>{
                            value2.r_periods.forEach((section)=>{
                                section.supervisors.forEach((supervisor)=>{
                                    supervisor = supervisor.toString().trim();
                                    if(list[supervisor]==null)
                                        list[supervisor] = [];
                                    list[supervisor].push( course.code );
                                });
                            });
                        });
                    });
                });
                
                $.each(list, (key,value)=>{
                    var uniquelist = [];
                    $.each(value, function(i, el){
                        if($.inArray(el, uniquelist) === -1) uniquelist.push(el);
                    });
                    list[key] = uniquelist;
                });
                
                var array = convertObjectToArrayWithKey(list);
                sortKeys(array, true);
                writeData('/professors', array);
                
    });
    
    
    
}

function writeData(path, data){
    database.ref(path).set(data);
}


function getData(path, callback) {
    return database.ref(path).once('value').then(callback);
}

function removeData(path) {
    database.ref(path).remove();
}


//SEPARATOR

function searchFor(courses) {
    
}

function sortResults(array, prop, asc) {
    if (prop == 'codenumber'){
        prop='code';
        return array.sort(function (a, b) {
            if (asc) {
                return (a[prop].split(' ')[1] > b[prop].split(' ')[1]) ? 1 : ((a[prop].split(' ')[1] < b[prop].split(' ')[1]) ? -1 : 0);
            } else {
                return (b[prop].split(' ')[1] > a[prop].split(' ')[1]) ? 1 : ((b[prop].split(' ')[1] < a[prop].split(' ')[1]) ? -1 : 0);
            }
        });
    }
    else
        return array.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
}


function sortKeys(array, asc){
    return array.sort(function (a, b) {
            if (asc) {
                return (Object.keys(a)[0] > Object.keys(b)[0]) ? 1 : ((Object.keys(a)[0] < Object.keys(b)[0]) ? -1 : 0);
            } else {
                return (Object.keys(b)[0] > Object.keys(a)[0]) ? 1 : ((Object.keys(b)[0] < Object.keys(a)[0]) ? -1 : 0);
            }
        });   
}

function convertObjectToArray(json) {
    var array = [];
    $.each(json, function (key, value) {
        array.push(value);
    });
    return array;
}

function test() {
    console.log();
}

function convertObjectToArrayWithKey(json) {
    var array = [];
    $.each(json, function (key, value) {
        key = key.replace('.','');
        var dummyobj = {};
        dummyobj[key]=value;
        array.push(dummyobj);
    });
    return array;
}

function test() {
    console.log();
}