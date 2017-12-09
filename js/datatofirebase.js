var database = firebase.database();
//2676 courses

function uploadToFirebase() {
    $.getJSON("data/databank.json", function (json) {
        console.log('\nOVERWRITING DATABASE CONTENTS WITH NEW DATA\n');
        assignID(json);
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
//        writeCoursesByName(json.timetables[2017][6].courses); //DONE Not needed?
//            writeProfessors();//DONE
        
        //SEPSEPSEPSEPSEPSDJFOSKDNCKJLDCMSDJVNCSD
        
        
//        writeCourseIndexedByID(json.timetables[2017][6].courses); //DONE
//        writeDepartmentToID(json.timetables[2017][6].courses, json.departments); //DONE
//        writeCourseCodeToID(json.timetables[2017][6].courses); //DONE
//          writeIndexes(json);
        
//        console.log(json);
    });
}



function writeCourseCodeToID(courses){
    var index = {};
    $.each(courses, (key,course)=>{
        var code = course.code.split(' ')[1];
        if(index[code] == null)
            index[code] = [];
        index[code].push(course.id);
    });
    writeData('coursecode_courseid', index);
}

function writeCourseCodeToID(courses){
    var index = {};
    $.each(courses, (key,course)=>{
        var code = course.code.split(' ')[1];
        if(index[code] == null)
            index[code] = [];
        index[code].push(course.id);
    });
    writeData('coursecode_courseid', index);
}

function writeDepartmentToID(courses, departments){
    var index = {};
    $.each(courses, (key,course)=>{
        if(index[course.department]==null)
            index[course.department]={};
        if(index[course.department].courses == null)
            index[course.department].courses = [];
        index[course.department].courses.push(course.id);
    });
    $.each(departments, (key, value)=>{
        index[key].name=value;
    });
    writeData('department_courseid', index);
}

function writeCourseIndexedByID(courses){
    var index = {};
    $.each(courses, (key,course)=>{
        index[course.id] = course;
    });
    writeData('courses', index);
}


function assignID(json){
    count=0;
    $.each(json.timetables[2017][6].courses, (key,value)=>{
        json.timetables[2017][6].courses[key].id=count;
        count++;
    });
//    console.log(json);
}

function writeIndexes(json){
    var index = {};
    var insignificants = ['and', 'or', 'to', 'of', 'in', 'i', 'a', 'the', 'on', 'an'];
    var depindex =  mapPropValuesToProp(index, json.departments, null, null, ' ', insignificants, 'department'); //null on both defaults to mapping value to the oject's key
    var nameindex =  mapPropValuesToProp(index, json.timetables[2017][6].courses, 'name', 'id', ' ', insignificants, 'id'); //map name words to ids
    mapInstructorsToID(json.timetables[2017][6].courses,index);
//    writeData('searchindex', index); //console.log(index);
}

function mapInstructorsToID(courses,index) {
    $.each(courses, (key, course) => {
        $.each(course.sections, (key1, value1) => {
            $.each(value1, (key2, value2) => {
                value2.r_periods.forEach((section) => {
                    section.supervisors.forEach((supervisor) => {
                        supervisor = supervisor.toString().trim();
                        supervisor.split(' ').forEach((name)=>{
                            name = name.replace(/\W+/g, "").toLowerCase();
                            if(name=="")
                                return;
                            if(index[name]==null)
                                index[name]=[];
                            index[name].push({indexedkey: course.id, type: 'id'});
                        });
                    });
                });
            });
        });
    });
}

function mapPropValuesToProp(index, obj, mapfrom, mapto, valsplit, insignificants, type){
        var def = false;
        if(mapfrom==null && mapto==null)
            def=true;
        $.each(obj,(key,value)=>{
            var tempsplit;
            if(def) tempsplit=value;
            else tempsplit=value[mapfrom];
            tempsplit.split(valsplit).forEach((word)=>{
                var wordform = word.replace(/\W+/g, "").toLowerCase();
                if(wordform=="" || wordform==null)
                    return;
                if(insignificants.indexOf(wordform)!=-1) //filter insignificants liek and, or, etc
                    return;
                var temparr;
                if(def) temparr = [{indexedkey: key, type: type}];
                else temparr = [{indexedkey: value[mapto], type: type}];
                
                if(index[wordform]==null)
                    index[wordform] = temparr;
                else    
                    index[wordform].push(temparr[0]);
                
            });
        });
}

//function mapValuesToKey(obj, valsplit, insignificants, type){
//    var array = [];
//        $.each(obj,(key,value)=>{
//            value.split(valsplit).forEach((word)=>{
//                var wordform = word.replace(/\W+/g, "").toLowerCase();
//                if(wordform=="" || wordform==null)
//                    return;
//                if(insignificants.indexOf(wordform)!=-1) //filter insignificants liek and, or, etc
//                    return;
//                
//                var tempobj = {};
//                tempobj[wordform] = {indexedkey: key, type: type};
//                array.push(tempobj);
//
//            });
//        });
//    return array;
//}


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

