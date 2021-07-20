function toggleElement(...arr) {
    for(var id of arr)
        var isVisible = $("#" + id).css('display') == "none" ? showElement(id) : hideElement(id);
}

function showElement(id, time = 0) { 
    $("#" + id).fadeIn(time); 
}

function hideElement(id, time = 0) { 
    $("#" + id).fadeOut(time); 
}

function slideRight(...ids) {
    for(var id of ids) {
        $("#" + id).removeClass("originalPos");
        $("#" + id).addClass("slideRight");
        setTimeout(function() {
            hideElement(id);
        }, 1000)
    }         
}

function slideOriginal(...ids) {
    for(var id of ids) {
        showElement(id);
        $("#" + id).addClass("originalPos");
        setTimeout(function() {
            $("#" + id).removeClass("slideRight");
        }, 1000)
    }              
}

function disableOptions(...arr) {
    for(var e of arr) {

        if($("#" + e + "Opt").parent().hasClass("selected") || $("#" + e + "Alrgy").parent().hasClass("selected")) {
            $("#" + e + "Opt").parent().removeClass("selected");
            $("#" + e + "Alrgy").parent().removeClass("selected");
            
            $("#" + e + "Opt").find("#check-plus").css("display", "none")
            $("#" + e + "Alrgy").find("#check-plus").css("display", "none")
        }                    
        $("#" + e + "Opt").parent().addClass("disabled");
        $("#" + e + "Alrgy").parent().addClass("disabled");
        
        $("#" + e + "Opt").find("#check-minus").css("display", "block")
        $("#" + e + "Alrgy").find("#check-minus").css("display", "block")
    }
}

function enableOptions(...arr) {
    for(var e of arr) {
        $("#" + e + "Opt").parent().removeClass("disabled");
        $("#" + e + "Alrgy").parent().removeClass("disabled");
        $("#" + e + "Opt").find("#check-minus").css("display", "none")
        $("#" + e + "Alrgy").find("#check-minus").css("display", "none")
    }
} 

function checkOptions() {
    if($("#breakfastOpt").parent().hasClass("selected")) {
        disableOptions("lunchDinner","egg","gluten","wheat")
    }
    else {
        enableOptions("lunchDinner","egg","gluten","wheat")
    }
    if($("#lunchDinnerOpt").parent().hasClass("selected")) {
        disableOptions("breakfast")
    }
    else {
        enableOptions("breakfast")
    }
}