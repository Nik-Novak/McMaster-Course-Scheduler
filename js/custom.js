jQuery(window).load(function() { 
		jQuery("#preloader").delay(100).fadeOut("slow");
		jQuery("#load").delay(100).fadeOut("slow");
});

// accordion collapse
var screenSwitch = document.getElementsByClassName("screenswitch");
$(".screenswitch").click(function(){
    var screen = $('#coursecontent').css('display');
    if(screen === "inline-block"){
        $( "#coursecontent" ).css( "display", "none" );
        $( "#menu" ).css( "display", "inline-block" );
        
    }
    else{
        $( "#coursecontent" ).css( "display", "inline-block" );
        $( "#menu" ).css( "display", "none" );
        
    }
    
    
})



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
