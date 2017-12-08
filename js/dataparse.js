//2676 courses
$.getJSON("data/databank.json", function(json) {
    //console.log(json);
    console.log(json.timetables[2017][6].courses);//console.log(Object.keys(json.timetables[2017][6].courses).length);
//    sortResults();
   var courses = convertKeysToArray(json.timetables[2017][6].courses);
    sortResults(courses, 'department', true);
    sortResults(courses, 'name', true);
    sortResults(courses, 'department', true);
    sortResults(courses, 'name', false);
    sortResults(courses, 'department', false);
    sortResults(courses, 'code', true);
    console.log(courses);
});

function sortResults(array, prop, asc) {
    if(prop=='code')
        return array.sort(function(a, b) {
        if (asc) {
            return (a[prop].split(' ')[1] > b[prop].split(' ')[1]) ? 1 : ((a[prop].split(' ')[1] < b[prop].split(' ')[1]) ? -1 : 0);
        } else {
            return (b[prop].split(' ')[1] > a[prop].split(' ')[1]) ? 1 : ((b[prop].split(' ')[1] < a[prop].split(' ')[1]) ? -1 : 0);
        }
    });
    else
    return array.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

function convertKeysToArray(json){
    var array = [];
    $.each( json, function( key, value ) {
        array.push(value); 
    });
    return array;
}

function test(){
    console.log();
}


test();