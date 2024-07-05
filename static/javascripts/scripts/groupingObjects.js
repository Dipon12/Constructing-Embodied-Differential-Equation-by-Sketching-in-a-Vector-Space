let groupObjects = [];

function createGroup(lassoPolygon, lineList, objectList){
    var group = new fabric.Group([lassoPolygon, lineList, ...objectList], {
        
    });
    canvas.add(group);
}


