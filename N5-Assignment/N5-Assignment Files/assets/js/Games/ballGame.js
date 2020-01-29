//source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
//my own edition
var phone = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)
var start = 0; fpsarr = []; second = 0; fps = 0; currentLevel = 0; screenMsg = ""; touches = 0;

if (phone) {
    joSt = { //joystick I created myself
        x: 0,
        y: 0,
        x1: 0,
        y1: 0,
        power: 0,
        rot: 0,
        fingerID: 0,
        active: false,
        draw: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, cw / 6, 0, Math.PI * 2);
            ctx.fillStyle = "#AAA";
            ctx.strokeStyle = "#000";
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
            ctx.closePath();
            if (this.active) {
                ctx.beginPath();
                ctx.arc(this.x1, this.y1, cw / 24, 0, Math.PI * 2);
                ctx.fillStyle = "#CCC";
                ctx.strokeStyle = "#000";
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    mouse = {
        x: 0,
        y: 0,
        move: function (evt) {
            for (var i = 0; i < evt.changedTouches.length; i++) {
                if (joSt.active && evt.changedTouches[i].identifier === joSt.fingerID) {
                    var x = evt.changedTouches[i].pageX;
                    var y = evt.changedTouches[i].pageY;
                    var dx = x - joSt.x;
                    var dy = y - joSt.y;
                    joSt.rot = Math.atan(dy / dx) + (dx > 0 ? 0 : Math.PI)
                    joSt.power = (Math.sqrt(Math.pow((x - joSt.x), 2) + Math.pow((y - joSt.y), 2))) / (cw / 8);
                    if (joSt.power < 1) {
                        joSt.x1 = x;
                        joSt.y1 = y;
                    } else {
                        joSt.power = 1;
                        joSt.x1 = joSt.x + cw / 8 * Math.cos(joSt.rot)
                        joSt.y1 = joSt.y + cw / 8 * Math.sin(joSt.rot)
                    }
                }
            }
        },
        start: function (evt) {
            var x = evt.changedTouches[0].pageX;
            var y = evt.changedTouches[0].pageY;
            if (Math.sqrt(Math.pow((x - joSt.x), 2) + Math.pow((y - joSt.y), 2)) < (cw / 8)) {
                joSt.fingerID = evt.changedTouches[0].identifier;
                joSt.active = true;
                joSt.x1 = x;
                joSt.y1 = y;
            } else {
                if (P.canJump) {
                    P.zv = 0.2;
                }
            }
        },
        end: function (evt) {
            if (joSt.active && joSt.fingerID === evt.changedTouches[0].identifier) {
                joSt.active = false;
                joSt.power = 0;
                P.xv = 0;
                P.yv = 0;
            }
        }
    }
} else {
    window.onkeydown = function (event) {
        event = event || window.event;
        return !(event.keyCode === 32)
    }
    document.addEventListener("keydown", function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
            case 38:
                P.yv = -0.1;
                break;
            case 65:
            case 37:
                P.xv = -0.1;
                break;
            case 83:
            case 40:
                P.yv = 0.1;
                break;
            case 68:
            case 39:
                P.xv = 0.1;
                break;
            case 32:
                if (P.canJump)
                    P.zv = 0.2;
                break;
        }
    });
    document.addEventListener("keyup", function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
            case 38:
                P.yv = 0;
                break;
            case 65:
            case 37:
                P.xv = 0;
                break;
            case 83:
            case 40:
                P.yv = 0;
                break;
            case 68:
            case 39:
                P.xv = 0;
                break;
                break;
            case 32:
                break;
        }
    });
}

window.onload = function () {
    c = document.getElementById("canvas");
    // cw = c.width = window.innerWidth/2;
    // ch = c.height = (window.innerWidth + window.innerHeight*0.15)/2;
    cw = c.width = 850;
    ch = c.height = 865;

    cdiag = Math.sqrt(ch * ch + cw * cw);
    ctx = c.getContext("2d");
    if (phone) {
        c = document.getElementById("canvas");
        c.addEventListener("touchstart", mouse.start, false);
        c.addEventListener("touchend", mouse.end, false);
        c.addEventListener("touchcancel", mouse.end, false);
        c.addEventListener("touchmove", mouse.move, false);
        window.ontouchmove = preventDefault;
        joSt.x = cw * 0.82;
        joSt.y = ch * 0.82;
    }
    arr = generateFromHash(decompress(levels[0]));
    arr[14][14][13] = 0;
    arr[14][14][14] = 0;
    world.update();
    if (phone) {
        alert("It seems like you are playing on a phone, move with the joystick, and press anywhere to jump. Tip: Avoid lava!");
    } else {
        alert("It seems like you are playing on a pc, use 'W-A-S-D' or arrow keys to move and 'Spacebar' to jump. Tip: Avoid lava!")
    }
    window.requestAnimationFrame(frame);
}

function frame(timestamp) {
    var ft = timestamp - start;
    var tr = ft / 16.6;
    second += ft;
    if (second > 500) {
        second = 0;
        fps = 0;
        for (var i = 0; i < fpsarr.length - 1; i++) {
            fps += fpsarr[i];
        }
        fps = Math.round(1000 / (fps / fpsarr.length));
        fpsarr = [];
    } else {
        fpsarr.push(ft);
    }
    start = timestamp;
    move(tr);
    world.update();
    if (graphics.fps) {
        ctx.font = cw / 20 + "px Arial"
        ctx.fillStyle = "#AFA";
        ctx.fillText(fps, 0, cw / 20);
    }
    if (phone) {
        joSt.draw();
    }
    window.requestAnimationFrame(frame);
}

function move(tr) {
    P.move(tr);
}

function drawButtons() {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, ch, cw, cw - ch);
    ctx.fillStyle = "#955";
    ctx.fillRect(0, ch, cw, (cw - ch) * world.z / 16);
    ctx.fillStyle = "#000";
    ctx.font = cw / 7 + "px Arial";
    ctx.fillText("UP", cw / 6, cw * 1.15);
    ctx.fillText("DOWN", cw * 0.5, cw * 1.15);
}

function fullA(a) {
    return [a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a];
}
function hollA(a) {
    return [a, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, a];
}
function empty(a) {
    return [fullA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), hollA(a), fullA(a)];
}
function filled(a) {
    return [fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a), fullA(a)];
}

arr = [filled(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), empty(1), filled(1)];

base64 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"];
//i know it looks silly, but I came up with this solution, and wikipedia told me these are the base64 symbols. ive never used encrypting before, and i just wanted to keep it simple
base16 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

function generateHash() {
    var hash = "";
    var current = [];
    for (var i = 1; i < 15; i++) {
        for (var j = 1; j < 15; j++) {
            for (var k = 1; k < 15; k++) {
                if (current.push(arr[i][j][k]) === 6) {
                    hash += convert2To64(current);
                    current = [];
                }
            }
        }
    }
    return current.join("") + hash;
}

function generateFromHash(hash, a) {
    if (!hash) {
        alert("Please input hash next to the button");
        return arr;
    }
    ba.lavaArr.splice(0);
    ba.bouncepadArr.splice(0);
    for (var i = hash.length; hash.charAt(i) !== "<" && i !== 0; i--) { }
    if (i !== 0) {
        var oh = hash.substr(i);    //object hash (contains information about where the objects are)
        hash = hash.substr(0, i);
        var len = "";
        for (var j = 0; oh.charAt(j) != "L" && j < oh.length; j++) {
            var temp = parseInt(oh.charAt(j));
            if (temp) {
                len += temp;
            }
        }
        if (j === oh.length) {
            var total = 1;
            len = 0;
        } else {
            var total = j + 1;
            len = parseInt(len);
        }
        for (i = 0; i < len; i++) {
            ba.lavaArr.push(new Lava(base16.indexOf(oh.charAt(total + i * 3)), base16.indexOf(oh.charAt(total + i * 3 + 1)), base16.indexOf(oh.charAt(total + i * 3 + 2))));
        }
        total += len * 3;
        len = "";
        for (j = total; oh.charAt(j) != "P" && j < oh.length; j++) {
            var temp1 = parseInt(oh.charAt(j));
            if (temp1) {
                len += temp1;
            }
        }
        len = parseInt(len);
        total = j + 1;
        for (i = 0; i < len; i++) {
            ba.bouncepadArr.push(new Bouncepad(base16.indexOf(oh.charAt(total + i * 3)), base16.indexOf(oh.charAt(total + i * 3 + 1)), base16.indexOf(oh.charAt(total + i * 3 + 2))));
        }
    }
    var PLoc = hash.substr(2, 3);
    var FLoc = hash.substr(5, 3);
    hash = hash.substr(0, 2) + hash.substr(8);
    a = a || 1;
    var output = [filled(a)];
    var cRow = [1];
    var cPlane = [fullA(a)];
    for (var i = 2; i < 459; i++) {
        var bin = convert64To2(hash[i]);
        while (bin.length > 0) {
            if (cRow.length === 15) {
                cRow.push(a);
                if (cPlane.length === 15) {
                    cPlane.push(fullA(a));
                    output.push(cPlane);
                    cPlane = [fullA(a), cRow];
                    cRow = [1];
                } else {
                    cPlane.push(cRow);
                    cRow = [1];
                }
            } else {
                cRow.push(bin.shift());
            }
        }
    }
    setLoc(P.spawn, PLoc);
    setLoc(P, PLoc);
    P.x += 0.5;
    P.y += 0.5;
    setLoc(flag, FLoc);
    cRow.push(hash[0]);
    cRow.push(hash[1]);
    cRow.push(a);
    cPlane.push(cRow);
    cPlane.push(fullA(a));
    output.push(cPlane);
    output.push(filled(a));
    return output;
}

function setLoc(ob, xyz) {
    ob.x = base16.indexOf(xyz.charAt(0));
    ob.y = base16.indexOf(xyz.charAt(1));
    ob.z = base16.indexOf(xyz.charAt(2));
}

function convert64To2(b64) {
    var output = [];
    var hex = base64.indexOf(b64);
    for (var i = 0; i < 6; i++) {
        output.push(hex % 2);
        hex = Math.floor(hex / 2);
    }
    return output;
}

function convert2To64(bin) {
    var temp = 0;
    for (var l = 0; l < 6; l++) {
        temp += bin[l] * Math.pow(2, l);
    }
    return base64[temp];
}

function preventDefault(e) {
    e = e || window.event;
    e.returnValue = false;
}

function shake(power) {
    power = power > 10 ? 10 : power;
    var shock = 1 / (20 - power);
    world.ddry = shock;
    world.ddrx = shock;
}

ba = {  //buildables
    lavaArr: [],
    bouncepadArr: []
}

var objectArray = [ba.lavaArr, ba.bouncepadArr];

var P = {
    spawn: {
        x: 1,
        y: 1,
        z: 1,
    },
    x: 10.5,
    y: 10.5,
    z: 3,
    //sz:1, //shadow
    xv: 0,
    yv: 0,
    zv: 0,
    block: [0, 0, 0, 1, 1, 1],  //array that contains info about what side of the current block is blocked (up, front, right, back, left, bottom)
    canJump: true,
    move: function (t) {
        if (phone) {
            this.xv = joSt.power * Math.cos(joSt.rot) / 10;
            this.yv = joSt.power * Math.sin(joSt.rot) / 10;
        }
        this.zv -= 0.017 * t;
        xv = this.xv * t; yv = this.yv * t; zv = this.zv * t;
        x = this.x; y = this.y; z = this.z;
        //for (var i = z; i > 0&&arr[x][y][i]; i--) {}
        //this.sz = i;
        this.block = blockdate(Math.floor(x), Math.floor(y), Math.floor(z));
        if (x + 0.25 + xv > Math.ceil(x) && this.block[2]) {
            this.x = Math.ceil(x) - 0.25;
        } else if (x - 0.25 + xv < Math.floor(x) && this.block[4]) {
            this.x = Math.floor(x) + 0.25;
        } else {
        this.x += xv;
            x = this.x; y = this.y; z = this.z;
            this.block = blockdate(Math.floor(x), Math.floor(y), Math.floor(z));
        } if (y + 0.25 + yv > Math.ceil(y) && this.block[1]) {
            this.y = Math.ceil(y) - 0.25;
        } else if (y - 0.25 + yv < Math.floor(y) && this.block[3]) {
            this.y = Math.floor(y) + 0.25;
        } else {
        this.y += yv;
            x = this.x; y = this.y; z = this.z;
            this.block = blockdate(Math.floor(x), Math.floor(y), Math.floor(z));
        } if (z + 0.25 + zv > Math.ceil(z) && this.block[0]) {
            this.z = Math.ceil(z) - 0.25;
            if (this.zv > 0.1)
                shake(this.zv / 3);
            this.zv = 0;
        } else if (z - 0.25 + zv < Math.floor(z) && this.block[5]) {
            this.z = Math.floor(z) + 0.25;
            for (var i = ba.lavaArr.length - 1; i >= 0; i--) {
                var c = ba.lavaArr[i];
                if (c.x === Math.floor(this.x) && c.y === Math.floor(this.y) && c.z === Math.floor(this.z)) {
                    P.x = P.spawn.x + 0.5;
                    P.y = P.spawn.y + 0.5;
                    P.z = P.spawn.z;
                }
            }
            if (this.zv < -0.4)
                shake(this.zv);
            this.zv = 0;
            for (var i = ba.bouncepadArr.length - 1; i >= 0; i--) {
                var c = ba.bouncepadArr[i];
                if (c.x === Math.floor(this.x) && c.y === Math.floor(this.y) && c.z === Math.floor(this.z)) {
                    P.z += 0.1;
                    P.zv = 0.4;
                }
            }
            this.canJump = true;
        } else {
            this.z += zv;
            this.canJump = false;
        }
        world.drx = this.x / 16;
        world.dry = this.y / 16;
        world.z = this.z + 1;
        if (world.z > 14.3) {
            world.z = 14.3;
        }
        if (Math.abs(flag.x + 0.5 - this.x) < 0.4 && Math.abs(flag.y + 0.5 - this.y) < 0.4 && Math.floor(this.z) === flag.z) {
            currentLevel++;
            if (currentLevel === levels.length) {
                alert("That were all the levels so far! Want to contribute by making more levels? \nThe Map Creator will come soon under the 'Games' section, please sign up to be updated!");
                arr = generateFromHash(decompress("00EE1;4;A;457;"));
                currentLevel = -1;
            } else {
                var lev = levels[currentLevel];
                if (Array.isArray(lev)) {
                    alert(lev[1]);
                    lev = lev[0];
                }
                arr = generateFromHash(decompress(lev));
            }
        }
    }
}

var levels = ["00EE1;4;A;224;BAEA;29;QA;4;MAwAADAMAwAADAMAwAADAMAwAADAMAgA;69;wAADAMAwAADAMAwAADAMAwAADAMAwA;67;",
    "00EE11E8A;19;EAQAABAEAQAAGA;6;BAEAQAABAEAQAABAEAQAABAEAAEA;5;QA;13;QAABAEAQAABAABA;5;EA;25;QA;6;BA;7;QAABAEAQAABAEAQAABEA;5;QA;8;EA;8;QA;8;BA;5;EA;8;DA;8;EA;7;QA;6;BA;7;wA;9;BA;7;EA;14;MA;8;QA;8;BAEAQAABAEAQAAADA;6;BAEAQAABAEQAABAEAQAABAEAAwA;6;QA;10;EAQAABAEAQAABAEMQAABAEEQAABAEAQAABAEAQAABAEAQAAADA;6;BA;24;wA;6;QA;11;<34LE81881681781A81981B81C81D816D17E16E17D17C16C16916A17A17918918A18C19D19E18E18D19C19A1A91991B91C91D91E912P8365B2",
    "00EE1;4;A;7;IAgAwDAIAgAACAIAgA;16;CAIA8AACAIAgAACAIA;15;gAACAPAgAACAIAgAACA;15;IAgAwDAIAgAACAIAgA;16;CAIA8AACAIAgAACAIAMAQAADA8DwPA/A8DwPA/A8DwPA/A8DwPA/AwDwPA;26;wA;4;MAwAADAMA;4;DAMAwAADAMAwA;16;DAAAwA;27;wA;4;MA;4;DA;22;MA;4;DAAAwA;18;MAwAADAMAwAACAMAwAADAMAwAADAMAwA;67;<9L565365165265465BB1AB19B18B11P5D2",
    "00EE1;4;AAgAQDAIA0DACAIAgAAOA4AgDACAIAgAAOA4A0DACANAgAQPANAgAQDA4A0AQPANA0AQDA9AgDQPA4AgDAOA4A0AAOAIAgDAOAIAgDAOAIA0AQDANAgDQDANA0DACANAgAACA9A0DQPANAgDACA4A0AAOA4AgDQPAIAgAACAIAgAQDA4A0AQPANAgAQDAIA0DACA9A0DQPA4A0AAOANAgDAOA4A0DQDA9AgAACAIA0AACAIAgDQDAIA0AACA9AgAAOAIAgAQPANA0DQPA9A0DAOA9AgAQPAIA0DQDAIAgDQDAIAgAAOAIAgAQDAIA0DACAIAgAQPA4A0AAOA9A0DQPA4A0DACA9A0AQPA4AgAACANAgDQAACAQAACANAgAAOAIAgAACAIA0DQPA9A0DQPA9AgAQPAIA0DQPA9A0AACAIAgAACAIAgAACAIA0DACAIAgAACAIA<81L132232332322312532522542462472282272152252352452552652752B72B62B52D72D62D52D42D32D22C32B32A328327127227329429229329529629727728726726824B24A22A23A2492592692892992A92E92C92D92B92DB2DC2DD2DE29E29D2BD2BC2BB2AB29B28B27B26B27C26D27D25D24D22C22E22D2",
    "00EE1;4;AA8PAhAEAQAABAEAQAwAAEAQAABADAQAw/A/DQIwAADAMAwAAEAMAwAADAQAwAAEAQIAhAECQAABAEAMAABAEAQAABAEAMAABAECMIwgADCMIApAjCQKwAAEAMAwAADAQAAhADCMIwgADCQKwCAkCMAABAEAQAABAEAQIwgADCMIwgAkCsKApADAQAwAADAMAABAEAMAwAADAMAABALAQAwAAEAQAABADAQAABAEAQAABAEAQAwCAEAMAABADAMAwAAEAQAwAADAMAwAAMAsAwCADAQAABAEAMAABAEAMAwAAEAMAACAAAgAwAAEAMAABADAQAABADAQAABADAsAwCALAMAABADAQAwAAEAQAwAADAQAwAAEAMAABADAMAABAEAMAABAEAQAABAEAQAABADAQAABAEAQAwAADAQAABADAMAwAADAQAwAAEAMAwAAEAQAwAAEA<118L243E236876775874874775674676671932932A32B31D32D33D34D34C34B3493593693793893993A93B93C93CA3BB3AB38B38C36B36C36D37D39D38D3AD3BD3CD3ED3DD3DC3EA3E93D73E73C73B83B73B63983973873773673573473373273263253633533543643743733723623523423433443453553653753C23C33B23A23923A33933943953A53B53C53E53E33E434193195192196196296396496596696796895894894794694594394493392391392P575A71",
    "00E128ADAhAECQAAhA;6;gAACAIA;6;IAgAACQIAhAEAQIAgIAiAICAQACBIEAAACAIAgAECQIABAECAICgIAiAAEAQACBIAgA;4;IAhAACA;6;gQACAIAABAEAQA;8;CQIAgA;6;BAEAQA;13;BAEgAECAIA;7;CBIEgQA;10;QAABIAhAACA;6;gAACBIEAQIAgAACAIEgQACQIAgA;7;IAgAACBAACAIAgAACBIEgAEA;18;gAECQIAhAECQIggAACA;6;gAACAIA;5;BAEAQAEBQEAMIAgIAgA;4;IAgAACA;4;QAABAEARAEBgBiAICAIA;4;CAIAgA;5;EAQAABQEARAJgMAiA;11;gAACAIBgEARAEBQEQCIJggAACIIgAACAIIwggBSDIHQMARAEB", "00EE11BEA;25;EAQAABAEA;25;BAEAQAABA;29;EAQA;30;BAEA;29;QAABA;29;EAQAABAEAQA;4;EAQAABAAAQAABAEA;4;BAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEAQAABAEA;4;BAEAQA;4;EAQAABAAAQA;32;EA;32;BA;31;QAABACAAAEAIAAAQAgA;13;<34L71E72E92EA2E73E84EA4EA3EA5E96E75E76E77E88EA7EA8EA9E9AE79E7BE7AE8CEABEACEADE7DE9EE6DE4DE3DE5DE2DE2CE2BE5PE3DE5AE86EB1EB",
    "00EE1;4;ABA8DAIAgAACAIAgAACAIAgAACAIAgAACQPAfAABAEAQAABAEAQAABAEAQAABAEAQAkCwHAIAgAACAIAgAACAIAgAACAIAgAACAzA8BACAEAQwABDEMQwABDEAQAABAEAQAAJA8AgAABACMIAgAACAIwgAACAIAgAACAgMA+AIDQMgw//7/;4;ABMEAQAABAEAQAAQAADASAEBI0/fAA8/PIAjAACAIAgAACAA4AwDgMAxAC/;7;DBwEAQAABAEAQAAACAEAIAQAgAABACwEAIAsAACAIAgAACAAgAABACAEAIwQAgAMBACAHAQAABAEAQAAAIAQAgAABACMEAIATAgAwBACAIAgAACAAACAEAIAQAgADBACwEAIAcAgAABAEAQAAAgAABACAEAIwQAgAMBACAHAIAQA;8;IAQAgAABACMEAIAQAgAwBACAEA;6;",
    "00EE1;4;IAMfAAAgBABAEAIAQAwAABA;4;//AAw/P6BzHAAAYAQA;7;wMATAcAwz/P/f8/zIw/A;6;EA;7;MAIAgAACAIAgEACAB8HAEAQAABA;7;DACAIAgAACAIBgwPAfAABA;11;wAgAACAIBgEASAIABAEA;14;MAIAgAASAIAgAAC/H8fw/B/H8/w/H//8/z/D/P8/0/T/P8/A;10;QAABAEAQAAhAECgIAkEgAAEA;10;EA;9;IAgEASAIBgAAGA;10;BA;9;CAIBgAACAIAgCA;9;QA;9;gAASAIBgEASAIBA;9;EAQAABAEAAIAgAACAIAgAACA;17;BAACAIAgAACAIAgA;17;QAgAABACAEA;6;",
    "00EE11EEA;25;EAQAABAUA;25;BAEAQAAJA;20;BAEAQAABAEAQEA;19;IA;12;CA;19;BA;12;BA;18;IA;12;gAACAIAgAACA;9;BA;21;gA;9;IA;22;IA;9;BA;17;IAgAACA;8;QA;18;CA;13;EA;17;gA;14;BA;17;IAgAACAIAgAACAQA;45;"
]


var flag = {
    x: 2,
    y: 3,
    z: 4
}

function Lava(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.draw = function (dxd, dyd, ck) {
        ctx.fillStyle = "#F50";
        ctx.fillRect(this.x * ck + dxd, this.y * ck + dyd, ck, ck);
    }
}

function Bouncepad(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.draw = function (dxd, dyd, ck) {
        ctx.fillStyle = "#904";
        ctx.save();
        ctx.translate(this.x * ck + dxd, this.y * ck + dyd);
        ctx.fillRect(ck / 8, ck / 8, ck * 0.75, ck * 0.75);
        ctx.fillStyle = "#C16";
        ctx.beginPath();
        ctx.arc(ck / 2, ck / 2, ck * 0.45, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function blockdate(x, y, z) {
    try {
        return [z <= 14 ? arr[x][y][z + 1] : 1, y <= 14 ? arr[x][y + 1][z] : 1, x <= 14 ? arr[x + 1][y][z] : 1, y >= 1 ? arr[x][y - 1][z] : 1, x >= 1 ? arr[x - 1][y][z] : 1, z >= 1 ? arr[x][y][z - 1] : 1];
    } catch (err) {
        throw "x: " + x + " y: " + y + " z: " + z + "    " + err;
    }
}

var graphics = {
    dt: true,    //dynamic top layer
    did: true,   //deeper is darker
    fps: true    //display FPS
}

var world = {
    z: 4, //it represents height, I know it should be Y, but I started with x and y when I started, it was easiest for me to use z
    per: 16, //perspective (after how many layers it is visually twice as small)
    drx: 0.5,
    dry: 0.5,
    ddrx: 0,
    ddry: 0,
    update: function () {
        ctx.save();
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, cw, ch);
        ctx.translate(cw / 20, cw / 20);
        ctx.lineWidth = cw / 600;
        ctx.strokeStyle = "#999";
        per = this.per + (P.zv < 0 ? P.zv * 20 : 0);
        var tot = cw - cw / 10; //total size of map
        var rt = tot * per / (-1 + per);
        var ck = tot / 16; //chunk (1/16 of total)
        if (Math.abs(this.ddrx) > 0.02) {
            this.ddrx /= (Math.random() < 0.5 ? -1.1 : 1.1);
            this.ddry /= (Math.random() < 0.5 ? -1.1 : 1.1);
        } else {
            this.ddrx = 0;
            this.ddry = 0;
        }
        var drx = this.drx + this.ddrx; //deviation ratio x
        drx = drx > 1 ? 1 : drx < 0 ? 0 : drx;
        dry = dry > 1 ? 1 : dry < 0 ? 0 : dry;
        var dry = this.dry + this.ddry; //deviation ratio y
        var dlb = drx * 16; //draw left border
        var dbb = dry * 16; //draw below border
        for (var z = 0; z <= this.z + graphics.dt; z++) {
            //this is a function i made which creates the perspective in the game (and i have tried ALLOT of functions, but this one was not only the simplest, and lightest for the processor, it also looks the best IMO)
            var rd = per / (this.z - z + per + 1); //ratio current layer (down)
            var ru = per / (this.z - z + per); //ratio one level above (up)
            var cku = ck * ru; //chunk up
            var ckd = ck * rd; //chunk down
            var dxu = (tot - (ru * tot)) * drx;  //deviation x up
            var dyu = (tot - (ru * tot)) * dry;  //deviation y up
            var dxd = (tot - (rd * tot)) * drx;  // deviation x down
            var dyd = (tot - (rd * tot)) * dry;  //deviation y down
            if (graphics.did) {
                ctx.fillStyle = "#000";
                ctx.globalAlpha = 0.1 * (this.z - z < 0 && graphics.dt ? this.z % 1 : 1);

                ctx.fillRect(dxd, dyd, tot * rd, tot * rd); //creates effect that deeper is darker
                ctx.globalAlpha = 1;
            }
            ctx.fillStyle = "#FFF";
            var dt = graphics.dt ? 1 : 0;
            for (var x1 = 0; x1 < 16; x1++) {
                var x = x1 < Math.floor(dlb) ? x1 : 16 - (x1 - (Math.ceil(dlb) - 1 - Math.ceil((dlb % 1)))); //first do x from 1-8 then from 16-8 (depending on where you are looking from (deviation ratio's)) otherwise drawimg looks messed up on the right side
                for (var y1 = 0; y1 < 16; y1++) {
                    var y = y1 < Math.floor(dbb) ? y1 : 16 - (y1 - (Math.ceil(dbb) - 1 - Math.ceil((dbb % 1))));
                    var xu = dxu + cku * x; xd = dxd + ckd * x; yu = dyu + cku * y; yd = dyd + ckd * y;  //current x location and y location, up and down
                    for (var i = objectArray.length - 1; i >= 0; i--) {
                        var c = objectArray[i];
                        if (Array.isArray(c)) {
                            for (var j = c.length - 1; j >= 0; j--) {
                                co = c[j];
                                if (x === co.x && y === co.y && z === co.z) { co.draw(dxd, dyd, ckd); j = 0; }
                            }
                        } else if (x === c.x && y === c.y && z === c.z) { j = 0; }
                    }
                    ctx.fillStyle = "#FFF";
                    if (arr[x][y][z]) {
                        //if there is a block
                        if (this.z - z < 0 && graphics.dt) ctx.globalAlpha = this.z % 1;
                        if (!arr[x][y][z + 1] || this.z - z < 1) {
                            //if there is not a block above the current block, or it is drawing the top layer, draw a square on top of the current block
                            ctx.fillRect(xu, yu, cku, cku);
                            //ctx.strokeRect(xu, yu, cku, cku);
                        }
                        if (x < dlb && arr[x + 1] && !arr[x + 1][y][z]) {
                            //if there is not a block on the right side and its at the left side of the draw left border, draw right wall (first proposition is to prevent it from trying to acces an empty array)
                            ctx.beginPath();
                            ctx.moveTo(xu + cku, yu);
                            ctx.lineTo(xd + ckd, yd);
                            ctx.lineTo(xd + ckd, yd + ckd);
                            ctx.lineTo(xu + cku, yu + cku);
                            ctx.closePath();
                            ctx.fill();
                            //ctx.stroke();
                        } else if (x > dlb && arr[x - 1] && !arr[x - 1][y][z]) {
                            ctx.beginPath();
                            ctx.moveTo(xu, yu);
                            ctx.lineTo(xd, yd);
                            ctx.lineTo(xd, yd + ckd);
                            ctx.lineTo(xu, yu + cku);
                            ctx.closePath();
                            ctx.fill();
                            //ctx.stroke();
                        } if (y < dbb && arr[x][y + 1] && !arr[x][y + 1][z]) {
                            ctx.beginPath();
                            ctx.moveTo(xu + cku, yu + cku);
                            ctx.lineTo(xd + ckd, yd + ckd);
                            ctx.lineTo(xd, yd + ckd);
                            ctx.lineTo(xu, yu + cku);
                            ctx.closePath();
                            ctx.fill();
                            //ctx.stroke();
                        } else if (y > dbb && arr[x][y - 1] && !arr[x][y - 1][z]) {
                            ctx.beginPath();
                            ctx.moveTo(xu + cku, yu);
                            ctx.lineTo(xd + ckd, yd);
                            ctx.lineTo(xd, yd);
                            ctx.lineTo(xu, yu);
                            ctx.closePath();
                            ctx.fill();
                            //ctx.stroke();
                        }
                        ctx.globalAlpha = 1;
                    }
                }
            }
            if (Math.floor(P.z) === z) {
                var pdz = P.z % 1;    //player deviation z
                var rp = per / (this.z - z + per + 1 - pdz);
                var ckp = ck * rp;    //chunk player
                var dxp = (tot - (rp * tot)) * drx;  //deviation x player
                var dyp = (tot - (rp * tot)) * dry;  //deviation y player
                ctx.beginPath();
                ctx.arc(dxp + ckp * P.x, dyp + ckp * P.y, ckp / 5, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = "#F00";
                ctx.fill();
            }
            if (flag.z === z) {  //drawing flag
                ctx.beginPath();
                ctx.moveTo(dxd + ckd * (flag.x + 0.5), dyd + ckd * (flag.y + 0.5));
                ctx.lineTo(dxu + cku * (flag.x + 0.5), dyu + cku * (flag.y + 0.5));
                ctx.closePath();
                ctx.strokeStyle = "#000";
                ctx.lineWidth = cw / 200;
                ctx.stroke();
                ctx.lineWidth = cw / 600;
                ctx.strokeStyle = "#999";
                var rp = per / (this.z - z + per + 1 - 0.25);
                var ckp = ck * rp;    //chunk point
                var dxp = (tot - (rp * tot)) * drx;
                var dyp = (tot - (rp * tot)) * dry;
                var rm = per / (this.z - z + per + 1 - 0.5);
                var ckm = ck * rm;    //chunk middle
                var dxm = (tot - (rm * tot)) * drx;
                var dym = (tot - (rm * tot)) * dry;
                ctx.beginPath();
                ctx.moveTo(dxu + cku * (flag.x + 0.5), dyu + cku * (flag.y + 0.5));
                ctx.lineTo(dxp + ckp * (flag.x + 1), dyp + ckp * (flag.y + 0.5));
                ctx.lineTo(dxm + ckm * (flag.x + 0.5), dym + ckm * (flag.y + 0.5));
                ctx.closePath();
                ctx.fillStyle = "#F00";
                ctx.fill();
            }
        }
        ctx.restore();
    },
    build: function (event) {
        event = event || window.event;
        var x = event.pageX - cw / 20;
        var y = event.pageY - cw / 20;
        var z = this.z;
        var size = (cw - cw / 10);
        var ck = size / 16;
        if (x > 0 && x < size && y > 0 && y < size) {
            var bx = Math.floor(x / ck);
            var by = Math.floor(y / ck);
            if (by !== 0 && by !== 15 && bx !== 0 && bx !== 15 && z !== 0 && z !== 15) {
                arr[bx][by][z] = arr[bx][by][z] === 1 ? 0 : 1;
                this.update();
                drawButtons();
            }
        } else if (x > 0 && x < size && y > size) {
            this.z = z + (x < size / 2 ? z !== 15 ? 1 : 0 : z !== 0 ? -1 : 0);
            this.update();
            drawButtons();
        }
        document.getElementById("hash").innerHTML = compress(generateHash());
    }
};

function compress(input) {
    for (var i = 0; i < input.length; i++) {
        for (var j = 0; input.charAt(i) === input.charAt(i + j); j++) { }
        if (j > 3) {
            out = input.substr(0, i + 1);
            out += ";" + j + ";";
            out += input.substr(i + j, input.length - 1);
            input = out;
            i += 2 + (j + "").length;
        } else { i += j - 1; }
    }
    return input;
}

function decompress(input) {
    for (var i = 0; i < input.length; i++) { //nr? i += parseInt(nr) : i++) {
        if (input.charAt(i) === ";") {
            var nr = ""; j = 1;
            while (true) {
                if (input.charAt(i + j) === ";") { break; }
                nr += input.charAt(i + j);
                j++;
            }
            var out = input.substr(0, i - 1)
            for (k = parseInt(nr); k > 0; k--) { out += input.charAt(i - 1) }
            out += input.substr(i + 2 + nr.length);
            input = out;
        }
    }
    return input;
}

function pasteHash() {
    a = document.getElementById("input").value || "00EE1;4;A;457;";
    arr = generateFromHash(decompress(a));
    world.update();
    currentLevel = -1;
}