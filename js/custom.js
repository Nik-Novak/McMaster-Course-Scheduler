jQuery(window).load(function() { 
		jQuery("#preloader").delay(100).fadeOut("slow");
		jQuery("#load").delay(100).fadeOut("slow");
});


// toggle screen
$(".screenswitch").click(function(){
    var screen = $('#coursecontent').css('display');
    if(screen === "inline-block"){
        $( "#coursecontent" ).css( "display", "none" );
        $( "#menu" ).css( "display", "inline-block" );
//        $("#coursecontent").animate({width:'toggle'},350);
    }
    else{
        $( "#coursecontent" ).css( "display", "inline-block" );
        $( "#menu" ).css( "display", "none" );
    }   
})

$(".remWeekend").click(function(){
    var tableDisplay = $('.sun').css('display');
    if(tableDisplay === "table-cell"){
        $( ".sun" ).css( "display", "none" );
        $( ".sat" ).css( "display", "none" );
    }
    else{
        $( ".sun" ).css( "display", "table-cell" );
        $( ".sat" ).css( "display", "table-cell" );
    }   
})






// accordion collapse
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}
