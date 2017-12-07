//2676 courses
$.getJSON("data/databank.json", function(json) {
    //console.log(json);
    console.log(json.timetables[2017][6].courses);//console.log(Object.keys(json.timetables[2017][6].courses).length);
//    sortResults();
   var courses = convertKeysToArray(json.timetables[2017][6].courses);
    sortResults(courses, 'name', true);
    console.log(courses);
});

function sortResults(array, prop, asc) {
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