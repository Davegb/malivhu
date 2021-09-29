$(document).ready(function() {
    while(document.getElementById('structure-data') === null){
        //DO NOTHING
        console.log("AA");
    }
    value = JSON.parse(document.getElementById('structure-data').text);
    console.log(value);
    document.getElementById("PSIPRED").innerText = value;
} );