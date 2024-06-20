let groupObjects = [];

function createGroup(lassoPolygon, objectList){
    var group = new fabric.Group([lassoPolygon, ...objectList], {
        subTargetCheck: true,
    });
    canvas.add(group);
}


