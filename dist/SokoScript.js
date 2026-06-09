"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let testGame;
const cellSize = 60;
const dirselect = document.getElementById('dirs');
dirselect.addEventListener("change", async () => {
    loadLvlsForDir();
    init();
});
const lvlselect = document.getElementById('lvls');
lvlselect.addEventListener("change", async () => {
    await loadLvl();
    init();
});
let playable = true;
function images(action) {
    return document.getElementById(action);
}
;
const charToAction = {
    "#": "block",
    "$": "crate",
    " ": "blank",
    ".": "goal",
    "@": "playerD",
    "@L": "playerL",
    "@R": "playerR",
    "@U": "playerU",
    "*": "onGoal",
    "+": "onPlayer"
};
;
;
;
;
let rowNum = 1;
let colNum = 0;
let sokobanSpace;
let sokobanCrates;
let playerMoves;
let crateMoves;
let onGoals = 0;
let direction;
const sokoban = document.getElementById("SOKOBAN");
/** @type {CanvasRenderingContext2D} */
const ctx = sokoban.getContext("2d");
init();
const player = {
    x: 0,
    y: 0,
    onGoal: false,
    move: function (dx, dy, grid) {
        const tx = player.x + dx;
        const ty = player.y + dy;
        if (grid == null || grid[ty] == null || grid[ty][tx] == null)
            return;
        if (grid[ty][tx].isWall == true) {
            return;
        }
        if (sokobanCrates.find((c) => c.x == tx && c.y == ty)) {
        }
        else {
            playerMoves.push({ x: tx, y: ty, crateMoved: false });
        }
        if (sokobanCrates.find((c) => c.x == tx && c.y == ty)) {
            if (moveCrate(dy, dx, tx, ty) == false) {
                return;
            }
            // moveCrate(dy, dx, tx, ty);
        }
        if (grid[ty][tx].char == ".") {
            player.onGoal = true;
        }
        else {
            player.onGoal = false;
        }
        // if (prevImage == "+") {
        //     prImg = sokobanSpace[player.y][player.x].char = "."
        // }
        player.x = tx;
        player.y = ty;
        refresh();
    },
    back: function () {
        // const currentPos = { x: player.x, y: player.y };
        // const  = playerMoves.findIndex((pos) => pos.x == currentPos.x && pos.y == currentPos.y);
        if (playerMoves[playerMoves.length - 2] == null) {
            return;
        }
        let newPlayerPos = playerMoves[playerMoves.length - 2];
        const index = playerMoves.findIndex((pos) => pos.x == newPlayerPos.x && pos.y == newPlayerPos.y);
        if (index < 0) {
            newPlayerPos = playerMoves[playerMoves.length - 1];
        }
        if (index == -1) {
            return;
        }
        let newCratePos = playerMoves[playerMoves.length - 1];
        if (newCratePos.crateMoved == true) {
            const crateIndex = crateMoves.findIndex((c) => c.x == newCratePos.x && c.y == newCratePos.y);
            if (crateIndex == -1) {
                return;
            }
            const crate = crateMoves.find((c) => c.x == newCratePos.x && c.y == newCratePos.y);
            const thisCratePos = [];
            for (const c of crateMoves) {
                if (c.crateIndex == crate.crateIndex) {
                    thisCratePos.push(c);
                }
            }
            const lastCratePos = thisCratePos[thisCratePos.length - 1];
            const nextCratePos = thisCratePos[thisCratePos.length - 2];
            const crates = sokobanCrates.find((c) => c.x == lastCratePos.x && c.y == lastCratePos.y);
            if (sokobanSpace[crates.y][crates.x].char == ".") {
                const crateI = sokobanCrates.findIndex((c) => c.x == crates.x && c.y == crates.y);
                sokobanCrates[crateI].onGoal = !sokobanCrates[crateI].onGoal;
                if (onGoals != 0) {
                    onGoals--;
                }
            }
            crates.x = nextCratePos.x;
            crates.y = nextCratePos.y;
            if (sokobanSpace[crates.y][crates.x].char == ".") {
                const crateI = sokobanCrates.findIndex((c) => c.x == crates.x && c.y == crates.y);
                sokobanCrates[crateI].onGoal = true;
                onGoals++;
            }
            crateMoves.splice(crateMoves.length - 1, 1);
            // playerMoves.splice(crateMoves.findIndex((c) => c.x == lastCratePos.x && c.y == lastCratePos.y), 1);
        }
        if (sokobanSpace[newPlayerPos.y][newPlayerPos.x].char == ".") {
            player.onGoal = true;
        }
        else {
            player.onGoal = false;
        }
        // const nextPlayerPos = playerMoves.findIndex((p) => p.crateMoved == false);
        // let nextPlayerPos;
        // for (const pos of playerMoves) {
        //     if (pos.crateMoved == false) {
        //         nextPlayerPos = playerMoves.findIndex((p) => p == pos);
        //     }
        // }
        player.x = newPlayerPos.x;
        player.y = newPlayerPos.y;
        if (index != 0) {
            playerMoves.splice(playerMoves.length - 1, 1);
        }
        refresh();
    },
    facing: function (dir) {
        switch (dir) {
            case "R":
                direction = "@R";
                break;
            case "L":
                direction = "@L";
                break;
            case "U":
                direction = "@U";
                break;
            default:
                direction = "@";
                break;
        }
    }
};
async function init() {
    if (testGame == undefined || testGame.length == 0) {
        await loadDirs();
    }
    let index = 0;
    sokobanSpace = [];
    sokobanCrates = [];
    playerMoves = [];
    crateMoves = [];
    onGoals = 0;
    let string = "";
    let char = testGame;
    colNum = 0;
    rowNum = 1;
    direction = "@";
    for (let i = 0; i < testGame.length; i++) {
        colNum = Math.max(colNum, testGame.length);
        rowNum = Math.max(rowNum, testGame[i].length);
        // if (lines[i].length >= lines[i + 1].length) {
        //     colNum = lines[i].length;
        //     break;
        // }
    }
    sokoban.setAttribute("width", `${rowNum * cellSize}px`);
    sokoban.setAttribute("height", `${colNum * cellSize}px`);
    for (let i = 0; i < char.length; i++) {
        if (char[i].length < rowNum) {
            for (let o = char[i].length; o < rowNum; o++) {
                char[i] += " ";
            }
        }
        string += char[i];
    }
    for (let y = 0; y < colNum; y++) {
        sokobanSpace[y] = [];
        for (let x = 0; x < rowNum; x++) {
            let charNow = string.substring(0 + index, 1 + index);
            if (charNow == "$" || charNow == "*") {
                crateMoves.push({ x: x, y: y, crateIndex: index, });
                if (charNow == "*") {
                    sokobanCrates.push({ x: x, y: y, onGoal: true, crateIndex: index });
                }
                else {
                    sokobanCrates.push({ x: x, y: y, onGoal: false, crateIndex: index });
                }
            }
            if (charNow == "@" || charNow == "+") {
                player.y = y;
                player.x = x;
                playerMoves.push({ x: x, y: y, crateMoved: false });
                if (charNow == "+") {
                    player.onGoal = true;
                    sokobanSpace[y][x] = {
                        char: ".",
                        isWall: false,
                        isPlayer: false,
                    };
                }
                else {
                    player.onGoal = false;
                }
            }
            if (charNow == "*") {
                sokobanSpace[y][x] = {
                    char: ".",
                    isWall: false,
                    isPlayer: false,
                };
            }
            if (charNow != "@" && charNow != "$" && charNow != "*" && charNow != "+") {
                sokobanSpace[y][x] = {
                    char: charNow,
                    isWall: false,
                    isPlayer: false,
                };
            }
            else if (charNow != "*" && charNow != "+") {
                sokobanSpace[y][x] = {
                    char: " ",
                    isWall: false,
                    isPlayer: false,
                };
            }
            if (charNow == "") {
                sokobanSpace[y][x] = {
                    char: " ",
                    isWall: false,
                    isPlayer: false,
                };
            }
            if (charNow == "#") {
                sokobanSpace[y][x].isWall = true;
            }
            index++;
        }
    }
    refresh();
}
async function loadDirs() {
    const dirs = await window.api.getdir();
    fillselDir(dirs);
    await loadLvlsForDir();
}
;
function fillselDir(dirs) {
    dirselect.innerHTML = "";
    for (let d of dirs) {
        dirselect.innerHTML += `<option value ="${d}">${d}</option>`;
    }
    ;
}
async function loadLvlsForDir() {
    const dirpath = dirselect.value;
    const levels = await window.api.getlvls(dirpath);
    fillSelLvls(levels);
    await loadLvl();
}
function fillSelLvls(levels) {
    lvlselect.innerHTML = "";
    for (let l of levels) {
        lvlselect.innerHTML += `<option value="${l}">${l}</option>`;
    }
}
async function loadLvl() {
    const dirpath = dirselect.value;
    const lvl = lvlselect.value;
    if (!dirpath || !lvl) {
        return;
    }
    const data = await window.api.loadlvl(dirpath, lvl);
    initLevel(data);
}
function initLevel(data) {
    testGame = data;
}
function refresh() {
    for (let y = 0; y < colNum; y++) {
        for (let x = 0; x < rowNum; x++) {
            // const e = sokobanSpace[y][x];
            ctx.fillStyle = "lightgreen";
            // let space = sokobanSpace;
            let char = sokobanSpace[y][x]?.char;
            if (char == undefined)
                return;
            // setTimeout(() => {
            // }, 1);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            let image = images(charToAction[char]);
            if (char != " ") {
                ctx.drawImage(images(charToAction[' ']), x * cellSize, y * cellSize);
                ctx.drawImage(image, x * cellSize + 5, y * cellSize + 5, 50, 50);
            }
            else {
                ctx.drawImage(image, x * cellSize, y * cellSize);
            }
            if (player.onGoal == true && player.x == x && player.y == y) {
                ctx.drawImage(images(charToAction["+"]), player.x * cellSize + 5, player.y * cellSize + 5, 50, 50);
            }
            else if (player.onGoal == false && player.x == x && player.y == y) {
                ctx.drawImage(images(charToAction[direction]), player.x * cellSize + 5, player.y * cellSize + 5, 50, 50);
            }
        }
    }
    for (let c of sokobanCrates) {
        if (sokobanSpace[c.y][c.x].char == "." && c.onGoal == true) {
            ctx.drawImage(images(charToAction["*"]), c.x * cellSize + 5, c.y * cellSize + 5, 50, 50);
        }
        else if (sokobanSpace[c.y][c.x].char == ".") {
            ctx.drawImage(images(charToAction["."]), c.x * cellSize + 5, c.y * cellSize + 5, 50, 50);
        }
        else {
            ctx.drawImage(images(charToAction["$"]), c.x * cellSize + 5, c.y * cellSize + 5, 50, 50);
        }
    }
}
function gameOver() {
    let overlay = document.getElementById("overlay");
    if (playable == true) {
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        overlay.style.height = "100%";
        overlay.style.width = "100%";
        overlay.style.display = "flex";
        overlay.innerHTML = "<h1>Bravo vous avez terminé</h1>\r\n<h2>Appuyer sur ESC ou R pour recommencer</h2>";
        overlay.style.fontSize = "20px";
        playable = false;
        return;
    }
    if (playable == false) {
        overlay.style.height = "0%";
        overlay.style.width = "0%";
        overlay.style.display = "none";
        overlay.innerHTML = "";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
        playable = true;
        return;
    }
}
function moveCrate(dy, dx, x, y) {
    for (let c of sokobanCrates) {
        if (c.x == x && c.y == y) {
            if (sokobanSpace[y + dy][dx + x].isWall == true) {
                return false;
            }
            if (sokobanCrates.find((crate) => crate.y == c.y + dy && crate.x == c.x + dx)) {
                return false;
            }
            const tx = x + dx;
            const ty = y + dy;
            if (sokobanSpace[c.y][c.x].char == ".") {
                c.onGoal = !c.onGoal;
                if (onGoals != 0) {
                    onGoals--;
                }
            }
            if (crateMoves.find((cr) => cr.x == c.x && cr.y == c.y)) {
                playerMoves.push({ x: x, y: y, crateMoved: true });
            }
            crateMoves.push({ x: tx, y: ty, crateIndex: c.crateIndex });
            c.x = tx;
            c.y = ty;
            if (sokobanSpace[c.y][c.x].char == ".") {
                c.onGoal = true;
                onGoals++;
            }
            if (onGoals == sokobanCrates.length) {
                gameOver();
            }
            //     sokobanSpace[c.y][c.x].char = "*";
            // else {
            //     sokobanSpace[c.y][c.x].char = "$";
            // }
        }
    }
    refresh();
}
document.addEventListener("keydown", function (event) {
    if (event.key == "Escape" || event.key == "r") {
        if (onGoals == sokobanCrates.length) {
            gameOver();
        }
        init();
    }
    if (playable == true) {
        if (event.key == "w" || event.key == "ArrowUp") {
            player.facing("U");
            player.move(0, -1, sokobanSpace);
        }
        if (event.key == "a" || event.key == "ArrowLeft") {
            player.facing("L");
            player.move(-1, 0, sokobanSpace);
        }
        if (event.key == "d" || event.key == "ArrowRight") {
            player.facing("R");
            player.move(1, 0, sokobanSpace);
        }
        if (event.key == "s" || event.key == "ArrowDown") {
            player.facing("D");
            player.move(0, 1, sokobanSpace);
        }
        if (event.key == "z") {
            player.back();
        }
    }
});
//# sourceMappingURL=SokoScript.js.map