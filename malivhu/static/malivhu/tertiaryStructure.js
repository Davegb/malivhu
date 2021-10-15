var structure = "";
var stage = null;
var polyParams = null;
var ligandParams = null;
var colorScheme = "";
var colorReverse = true;

function makeImage(){
    proteinName = JSON.parse(document.getElementById('name-data').text);
    stage.makeImage({factor: 4, trim: false, transparent: true, antialias: true}).then(function (viewer) {
        NGL.download(viewer, proteinName + ".png");
    });
}

function changeRepresentation(representation, sele) {
    repName = representation.replace("ligand", "")
    el = document.getElementById(representation);
    repsList = stage.getRepresentationsByName(repName).list
    for(rep of repsList) {
        if(rep.getParameters().sele === sele){
            if(rep) {
                stage.compList[0].removeRepresentation(rep)
                el.classList.remove("nav-link-selected");
            }
            stage.autoView();
            return;
        }
    }
    el.classList.add("nav-link-selected");
    if(sele === "ligand") { 
        stage.compList[0].addRepresentation(repName, ligandParams);
    } else {
        stage.compList[0].addRepresentation(repName, polyParams);
    }
    stage.autoView();
}

function changeColorScheme(color, sele){
    colorName = color.replace("ligand", "")
    if(colorName !== colorScheme)
    {
        listColor = null;
        if (sele === "ligand"){
            listColor = document.getElementById("listColorSchemesLigand").children;
            ligandParams.colorScheme = colorName;
        }
        else{
            listColor = document.getElementById("listColorSchemes").children;
            polyParams.colorScheme = colorName;
        }
        for(rep of stage.compList[0].reprList) {
            if(rep.getParameters().sele === sele) {
                rep.setColor(colorName);
            }
        }
        for(item of listColor) {
            item.children[0].classList.remove("nav-link-selected");
        }
        document.getElementById(color).classList.add("nav-link-selected");
        stage.autoView();
    }
}

$(document).ready(function() {
    while(document.getElementById('structure-data') === null){
        //DO NOTHING
    }
    stage = new NGL.Stage("ngl", {backgroundColor: "#f5f4ed"});
    stage.handleResize();
    stage.signals.hovered.add(function (pickingProxy) {
        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
            var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
            var cp = pickingProxy.canvasPosition;
        }
    });
    var orientationMatrix = stage.viewerControls.getOrientation();
    stage.viewerControls.orient(orientationMatrix);
    structure = JSON.parse(document.getElementById('structure-data').text);
    var stringBlob = new Blob( [ structure ], { type: 'text/plain'} );
    var reader = new FileReader();
    reader.readAsText(stringBlob);
    stage.loadFile(stringBlob, { ext: "pdb", defaultRepresentation: true }).then(function(o){
        console.log(o);
        repsList = stage.compList[0].reprList;
        for(rep of repsList) {
            if(rep.getParameters().sele === "")
                polyParams = rep.getParameters();
            else if(rep.getParameters().sele === "ligand")
                ligandParams = rep.getParameters();
        }
        if(!polyParams) { 
            polyParams = {
                "colorScheme": "residueindex", 
                "colorScale": "spectral", 
                "colorReverse": true, 
                "surfaceType": "sas"
            }
        }
        if(!ligandParams) { 
            ligandParams = {
                "colorScheme": "element", 
                "colorScale": "", 
                "colorReverse": false, 
                "surfaceType": "sas"
            }
        }
        for(i = repsList.length - 1; i >= 0; i--) {
            rep = repsList[i]
            if(rep.getParameters().sele !== "")
                stage.compList[0].removeRepresentation(rep);
        }
    });
});