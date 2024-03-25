function toggleDropDown(){
    var dropDown =  document.getElementById("nav-drop-down") 
    dropDown.style.display = (dropDown.style.display === 'block')? "none":"block";
}

window.onclick = function (event){
    if(!event.target.matches('.drop-down-btn')){
        var dropdowns = document.getElementsByClassName("drop-down-content")
        for(var i=0; i < dropdowns.length; i++){
            var openDropdown = dropdowns[i];
            if(openDropdown.style.display === 'block'){
                openDropdown.style.display = 'none';
            }
        }
    }
}

