var database = firebase.database();

$(document).ready(() => {
    fireTest();
});


function fireTest() {
    return firebase.database().ref('mcmaster-course-scheduler').once('value').then(function (snapshot) {
        console.log(snapshot);
        // ...
    });
}
