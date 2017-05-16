

var debugObjects;
debugging = true;
//document.getElementById('debugger').innerHTML = "<input type='button' value='debug' onclick='DebugCreate()'>";

function LoadDebugObjects() {
    debugObjects = [
        {name: "Asteroid", pool: asteroidPool, data: {
                tier: {min: 1, max: 3}, 
                x: 0, 
                y: 0
            }
        }, 

        {name: "Square", pool: squarePool, data: {
                speed: 0
            }
        }, 

        {name: "Fuel", pool: fuelPool, data: {}}
    ];
}


function DebugCreate() {

    debugging = true;
    console.log("Debugging enabled");

    LoadDebugObjects();

    var stuff = "<input style='width: 40px;' type='number' value='1' min='1' max='100' id='spawnNum'>";

    // Create drop down list for spawnable objects
    stuff += "<select id='spawnObj' onchange='GetOptions()'>";
    for (var i = 0; i < debugObjects.length; i++) {
        stuff += "<option value='" + i + "'>" + debugObjects[i].name + "</option>";
    }
    stuff += "</select>";

    // Create button
    stuff += "<input type='button' value='spawn' onclick='DebugSpawn()'>";

    stuff += "</br>";

    // Create x y inputs
    stuff += "x: ";
    stuff += "min<input style='width: 40px;' type='number' value='0' min='0' max='800' id='spawnXmin'>";
    stuff += "max<input style='width: 40px;' type='number' value='800' min='0' max='800' id='spawnXmax'>";
    stuff += "</br>y: ";
    stuff += "min<input style='width: 40px;' type='number' value='0' min='0' max='600' id='spawnYmin'>";
    stuff += "max<input style='width: 40px;' type='number' value='600' min='0' max='600' id='spawnYmax'>";

    

    document.getElementById('debugMain').innerHTML = stuff;
    GetOptions();

}

function GetOptions() {
    var stuff = "";
    var o = debugObjects[document.getElementById("spawnObj").value];

    for (var key in o.data) {
        if (!o.data.hasOwnProperty(key)) return;

        var extras = "";
        var value = o.data[key];
        var min = o.data[key].min;
        var max = o.data[key].max;

        // Check for min/max values
        if (max != null) {
            extras += " max='" + max + "'";
            value = 0;
        }

        if (min != null) {
            extras += " min='" + min + "'";
            value = parseInt(min);
        }
        
        stuff += key + ": ";
        stuff += " min<input style='width: 40px;' type='number' value='" + value + "'" + extras +  " id='debug_" + key + "_min'>";
        stuff += " max<input style='width: 40px;' type='number' value='" + value + "'" + extras +  " id='debug_" + key + "_max'></br>";
    }

    document.getElementById('debugOptions').innerHTML = stuff;
}

function DebugSpawn() {
    var num = document.getElementById("spawnNum").value;
    var o = debugObjects[document.getElementById("spawnObj").value];
    var pool = o.pool;
    var xMin = document.getElementById("spawnXmin").value;
    var xMax = document.getElementById("spawnXmax").value;
    var yMin = document.getElementById("spawnYmin").value;
    var yMax = document.getElementById("spawnYmax").value;

    var data = {};

    for (var i = 0; i < num; i++) {
        // Fill data object with input options
        for (var key in o.data) {
            if (!o.data.hasOwnProperty(key)) return;
            var min = parseInt(document.getElementById("debug_" + key + "_min").value);
            var max = parseInt(document.getElementById("debug_" + key + "_max").value);
            data[key] = Math.floor((Math.random() * (max - min + 1)) + min);
        }
        var x = Math.floor((Math.random() * (xMax - xMin + 1)) + xMin);
        var y = Math.floor((Math.random() * (yMax - yMin + 1)) + yMin);

        console.log({"x" : x, "y": y, "Data": data});
        pool.create(parseInt(x), parseInt(y), data);
    }
}