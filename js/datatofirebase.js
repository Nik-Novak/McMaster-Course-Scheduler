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
        
            getData('/course_department',(e)=>{
                var list = [];
                e.val().forEach((course)=>{
                    $.each(course.sections, (key1,value1)=>{
                        $.each(value1, (key2,value2)=>{
                            value2.r_periods.forEach((section)=>{
                                if(section.supervisors.length > 1)
                                    list.push(section.supervisors);
                            });
                        });
                    });
                });
                console.log(list);
            });


    });
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
    var empty = [];
    courses.forEach((e) => {
        if (e.sections.C != null && e.sections.C != undefined && e.sections.C.C01 != null && e.sections.C.C01.r_periods != null)
            e.sections.C.C01.r_periods.forEach((f) => {
                if (f.day == 6)
                    empty.push(e);
            });
    });
    console.log(empty);
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