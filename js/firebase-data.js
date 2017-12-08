var database = firebase.database();

$(document).ready(() => {
    fireTest();
});


function fireTest() {
    var userId = '1cedb40b-b869-439a-b4b7-ab4dd77387b1';
    return firebase.database().ref(userId).once('value').then(function (snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        // ...
    });
}
