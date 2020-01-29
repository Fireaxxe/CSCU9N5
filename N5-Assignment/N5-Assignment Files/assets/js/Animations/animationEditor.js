
alert("For more information tap the question mark in the top right corner.");


//// variables... ////

//// ...for the canvas ////
var width = (window.innerWidth * 0.8) / 2.3;
var height = width;

//// ...for the frames ////
var frames = [];
var cF;
var fps = 12;
var interval = null;
var loop = true;

//// ...for the grid and tiles ////
var grid = [];
var gridSize = 16;
var tileSize = width / gridSize;
var bgColor = "#ffffff"

//// ...and some extra ones ////
var showGrid = true;
var onionskin = true;
var showSettings = false;
var darkmode = false;
var tool = "pencil";

var clipboard = [];
var memory = [];
var maxAlpha = 1;


//// this function starts the program ////
onload = function () {
    //// creating the canvas ////
    c = document.createElement("canvas");
    ctx = c.getContext("2d");
    c.width = width;
    c.height = height;

    main.insertBefore(c, pageNum.nextSibling);

    //// generating the grid ////
    new Frame();

    //// adding the event listeners ////

    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        c.addEventListener("touchstart",
            function (e) {
                touchstart(e)
            });
        c.addEventListener("touchmove",
            function (e) {
                touchmove(e)
            });
    } else {
        c.addEventListener("mousedown",
            function (e) {
                mousedown(e)
            });
        c.addEventListener("mousemove",
            function (e) {
                mousemove(e)
            });
        c.addEventListener("mouseup",
            function (e) {
                mouseup(e)
            });
    }

    //// some important functions ////
    init();
    update();
    setActive(pauseButton);

}

//// onclick event ////
onclick =
    function (e) {
        if (showSettings) {
            update();
            return;
        }

        update();
    }

//// tile constructor ////
function Tile(x, y, v) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.val = v || bgColor;

    this.draw = function () {
        ctx.fillStyle = this.val;
        ctx.fillRect(this.x,
            this.y,
            tileSize,
            tileSize
        );
    }
}

//// frame constructor ////
function Frame(index) {
    if (index == undefined) {
        frames.push([]);
        cF = frames.length - 1;
    }
    else {
        frames.splice(cF, 0, []);
    }

    for (var i = 0; i < gridSize; i++) {
        frames[cF].push([])
        for (var j = 0; j < gridSize; j++) {
            frames[cF][i].push(new Tile(i, j));
        }
    }
}

//// getting the clicked tile ////
function clickedTile(x, y) {
    for (var i in grid) {
        for (var j in grid[i]) {
            var tile = grid[i][j];
            if (x > tile.x &&
                x < tile.x + tileSize &&
                y > tile.y &&
                y < tile.y + tileSize)
                return tile;
        }
    }
    return null;
}

//// draws the tiles ////
function drawTiles() {
    ctx.globalAlpha = maxAlpha;
    for (var i in grid) {
        for (var j in grid[i]) {
            grid[i][j].draw();
        }
    }
    if (onionskin) {
        ctx.globalAlpha = maxAlpha / 3;
        for (var i in frames[cF - 1]) {
            for (var j in frames[cF - 1][i]) {
                if (frames[cF - 1][i][j].val != bgColor)
                    frames[cF - 1][i][j].draw();
            }
        }
    }
}

//// draws the lines or grid ////
function drawGrid() {
    ctx.strokeStyle = "gray";
    ctx.globalAlpha = maxAlpha;
    for (var i in grid) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(width, i * tileSize);
        ctx.stroke();
    }
}

//// controls ////
function play() {
    setActive(playButton);
    setInactive(pauseButton);
    setInactive(reverseButton);

    clearInterval(interval);
    interval = setInterval(
        function () {
            if (cF == frames.length - 1) {
                if (loop)
                    cF = 0;
                else {
                    pause();
                }
            } else
                cF++;
            update();
        }, 1000 / fps);
}
function pause() {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
        setInactive(playButton);
        setActive(pauseButton);
        setInactive(reverseButton)
    }
    else
        return;
}
function reverse() {
    setInactive(playButton);
    setInactive(pauseButton);
    setActive(reverseButton)
    clearInterval(interval);
    interval = setInterval(
        function () {
            if (cF == 0) {
                if (loop)
                    cF = frames.length - 1;
                else {
                    pause();
                }
            } else
                cF--;
            update();
        }, 1000 / fps);
}


//// update everything ////
function update() {
    ctx.clearRect(0, 0, width, height);

    grid = frames[cF];
    fps = fpsInp.value

    drawTiles();
    if (showGrid)
        drawGrid();

    pageNum.innerHTML = cF + 1 + "/" + frames.length;

    if (tool == "pencil") {
        setActive(pencil);
        setInactive(eraser);
        setInactive(picker);
    }
    if (tool == "eraser") {
        setInactive(pencil);
        setActive(eraser);
        setInactive(picker);
    }
    if (tool == "picker") {
        setInactive(pencil);
        setInactive(eraser);
        setActive(picker);
    }

    updateSettings();
}


//// settings ////
function openSettings() {
    showSettings = !showSettings;
    getArr();
    if (showSettings) {
        settingsmenu.style.display = "block";
        settingsmenu.style.opacity = 0.9;
    }
    else {
        settingsmenu.style.display = "none";
        settingsmenu.style.opacity = 0;
    }

}

function changeSize() {
    gridSize = gridSizeInp.value;
    tileSize = width / gridSize;
    frames = [];
    cF = 0;
    new Frame();
}

//// getting the colorcode ////
function getColor() {
    return color.value;
}

//// update all css of the settings ////
function updateSettings() {
    toggleLoop.setAttribute("class", loop);
    toggleOnion.setAttribute("class", onionskin);
    toggleGrid.setAttribute("class", showGrid);
}

//// an unnecessary function
function newFrame() {
    if (interval == null)
        new Frame(cF + 1)
}
function copy() {
    if (interval == null)
        clipboard = frames[cF];
}
function paste() {
    if (interval == null) {
        if (clipboard == [])
            return;

        for (var i in clipboard) {
            for (var j in clipboard[i]) {
                frames[cF][i][j].val = clipboard[i][j].val;
            }
        }
    }
    //frames[cF] = clipboard;
}
function deleteFrame(index) {
    if (interval == null) {
        if (cF == 0 && frames.length == 2)
            cF++;

        var temp = frames[index];
        frames.splice(index, 1);
        for (var i = temp.length - 1; i >= 0; i--)
            delete temp[i];


        if (cF == 0 && frames.length <= 1)
            new Frame();
        else {
            if (cF != 0)
                cF--;
        }
    }
}

function clearGrid(index) {
    var f = frames[index];
    for (var i in f) {
        for (var j in f[i]) {
            f[i][j].val = bgColor;
        }
    }
}

//// generating the 'help-alert'
function help() {
    var helpMsg = [
        "",
        "#############",
        "If you want a demo animation press 'OK' and then press the PLAY button, if not press 'CANCEL'",
        "#############",
        "",
        "Basics:",
        "✏️ ~ Pencil, used to draw",
        "📘 ~ Eraser, used to erase (yes, it's a book)",
        "🖊️ ~ Colorpicker, pick the color of a tile",
        "🔲 ~ Clear, clears the current frame",
        "",
        "💾 ~ Save your animation by going into the settings and copying the string of the first input field in the save/load section",
        "📝 ~ Load an animation by going into the settings and pasting your string in thr second input field in the save/load section, after that press the 'load video' button",
        "\n",
        "Buttons:",
        "▶️ ~ Plays the animation",
        "⏸️ ~ Pauses the playing animation",
        "◀️ ~ Plays the animation in reverse",
        "⏮️ ~ Jumps to the previous frame",
        "⏭️ ~ Jumps to the next frame",
        "",
        "🔅 ~ Adds a new frame after the current one",
        "🗑️ ~ Deletes the current frame",
        "📥 ~ Copy's the current frame",
        "📤 ~ Pastes the last copied frame",
        "",
        "⚙️ ~ Takes you to the settings",
        "❓ ~ Gives you info about all buttons",
        "\n",
        "To-Do:",
        "- colorpicker",
        "- brushwidth",
        "- undo and redo",
        "\n",
        "Created by:",
        "The Coding Sloth, 20-07-2017"
    ];

    var str = "";
    for (var i in helpMsg)
        str += helpMsg[i] + "\n";

    if (confirm(str))
        load(document.querySelector('#stringInp').value);
}


function toggleMode() {
    darkmode = !darkmode;
    if (darkmode) {
        body.style.backgroundColor = "#333"
        body.style.color = "white";
        toggleModeButton.innerHTML = "dark mode";
        maxAlpha = 0.7;
    }
    else {
        body.style.backgroundColor = "rgb(249, 253, 255)"
        body.style.color = "black";
        toggleModeButton.innerHTML = "light mode"
    }
}

function getArr() {
    var str = fps + "@" + gridSize + "_";
    for (var i in frames) {
        for (var j in frames[i]) {
            for (var k in frames[i][j]) {
                if (frames[i][j][k].val == bgColor)
                    continue;

                str += "|" +
                    parseInt(frames[i][j][k].x / tileSize) +
                    "-" +
                    parseInt(frames[i][j][k].y / tileSize) +
                    "-" +
                    frames[i][j][k].val +
                    "|";
            }
        }
        str += " "
    }
    document.querySelector("#get").value = str;
}


function load(demo) {

    var constants = demo.split("_")[0];
    fpsInp.value = constants.split("@")[0];
    gridSizeInp.value = constants.split("@")[1];
    changeSize();

    demo = demo.split(" ");
    frames = [];
    cF = 0;

    for (var i in demo)
        new Frame(i);


    for (var i in demo) {
        if (demo[i].indexOf("-") == -1)
            continue;


        var frame = frames[i];
        var data = demo[i].split("|");

        for (var j in data) {
            if (data[j].indexOf("-") == -1)
                continue;

            var d = data[j].split("-");
            var x = d[0];
            var y = d[1];
            var v = d[2];

            frame[x][y].val = v;
        }
    }
}

//// query selectors ////
function init() {
    body =
        document.querySelector("body");
    main =
        document.querySelector("#main");
    settings =
        document.querySelector("#settings");
    settingsmenu =
        document.querySelector("#settingsmenu");
    fpsInp =
        document.querySelector("#fps");
    gridSizeInp =
        document.querySelector("#gridSize");
    color =
        document.querySelector("#color");
    pageNum =
        document.querySelector("#pageNum");
    toggleLoop =
        document.querySelector("#toggleLoop");
    toggleGrid =
        document.querySelector("#toggleGrid");
    toggleOnion =
        document.querySelector("#toggleOnion");
    playButton =
        document.querySelector("#play");
    pauseButton =
        document.querySelector("#pause");
    reverseButton =
        document.querySelector("#reverse");
    toggleModeButton =
        document.querySelector("#mode");
    pencil =
        document.querySelector("#pencil");
    eraser =
        document.querySelector("#eraser");
    picker =
        document.querySelector("#picker");
}

var temp = [];
function undo() {
    var action = memory[memory.length - 1]
    temp.push(action);
    frames[action[3]][action[0]][action[1]].val = action[2];
    memory.pop();
}

//// touch events ////
//// BY: CHESSMASTER ////

function touchstart(e) {
    var touches = e.changedTouches;
    memory.push([]);
    var t = touches[touches.length - 1];
    var x = t.clientX -
        c.offsetLeft;
    var y = t.clientY -
        c.offsetTop;

    try {
        var tile = clickedTile(x, y);
        memory[memory.length - 1].push(
            [x, y, tile.val, cF]
        );

        if (tool == "eraser")
            tile.val = bgColor;
        else if (tool == "pencil")
            tile.val = getColor();
        else if (tool == "picker")
            color.value = tile.val;

    } catch (err) { };

    update();
}

function touchmove(e) {
    e.preventDefault();
    var touches = e.changedTouches;

    var t = touches[touches.length - 1];
    var x = t.clientX -
        c.offsetLeft;
    var y = t.clientY -
        c.offsetTop;

    try {
        var tile = clickedTile(x, y);
        memory[memory.length - 1].push(
            [x, y, tile.val, cF]
        );

        if (tool == "eraser")
            tile.val = bgColor;
        else if (tool == "pencil")
            tile.val = getColor();
        else if (tool == "picker")
            return;

    } catch (err) { };

    update();
}

var down = false;
function mousedown(e) {
    var x = e.clientX -
        c.offsetLeft;
    var y = e.clientY -
        c.offsetTop;

    down = true;

    try {
        var tile = clickedTile(x, y);

        if (tool == "eraser")
            tile.val = bgColor;
        else if (tool == "pencil")
            tile.val = getColor();
        else if (tool == "picker")
            color.value = tile.val;

    } catch (err) { };

    update();
}

function mousemove(e) {
    if (down) {
        var x = e.clientX -
            c.offsetLeft;
        var y = e.clientY -
            c.offsetTop;

        try {
            var tile = clickedTile(x, y);

            if (tool == "eraser")
                tile.val = bgColor;
            else if (tool == "pencil")
                tile.val = getColor();
            else if (tool == "picker")
                return;

        } catch (err) { };

        update();
    }
}

function mouseup() {
    down = false;
}
function setInactive(elem) {
    elem.style.transform = "translate(0, 0)";
    elem.style.boxShadow = "0 3px #999";
}
function setActive(elem) {
    elem.style.transform = "translate(0, 2px)";
    elem.style.boxShadow = "0 0 #666";
}