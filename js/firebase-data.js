var database = firebase.database();

$(document).ready(() => {
    
//    getData('/',(snapshot)=>{
//        console.log(snapshot.val()); //print whoel database
//    });
//    
//    getData('departments',(e)=>{
//        var departments = e.val();
//        console.log(departments);
//    });
    
    loadDepartments();
    
    
});

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
        console.log(departments);
    });
}

function getData(path, callback) {
    return firebase.database().ref(path).once('value').then(callback);
}

function onData(path, callback) {
    return firebase.database().ref(path).on('value',callback);
}