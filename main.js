tm.main(function() {
    var tetris = Tetris();
    tetris.run();
    tetris.blocks.next();
});

var Tetris = tm.createClass({
    superClass: tm.app.CanvasApp,
    init: function() {
        this.superInit("#world");
        this.resize(10 * 10, 10 * 20);
        this.blocks = Blocks(this);
        this.currentScene.addChild(this.blocks);
    },
    blocks: null,
    update: function() {
        if (this.keyboard.getKey("left")) {
            this.blocks.moveLeft();
        } else if (this.keyboard.getKey("right")) {
            this.blocks.moveRight();
        }
        if (this.frame % 5 === 0) {
            if (this.blocks.checkLand()) {
                this.blocks.fix();
                var lines = this.blocks.checkLines().sort();
                for (var i = 0; i < lines.length; i++) {
                    this.blocks.eraseLine(lines[i]);
                }
                if (!this.blocks.next()) {
                    return this.gameover();
                }
            } else {
                this.blocks.fall();
            }
        }
    },
    gameover: function() {
        alert("gameover");
        this.stop();
    }
});

var Blocks = tm.createClass({
    superClass: tm.app.CanvasElement,
    cells: [],
    position: { x: 0, y: 0},
    current: null,
    init: function(tetris) {
        this.superInit(tetris.width, tetris.height);
        for (var i = 0; i < 20; i++) {
            this.cells[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    },
    draw: function(canvas) {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x]) {
                    canvas.setFillStyle("#ffffff")
                        .fillRect(x*10, y*10, 10, 10)
                        .setFillStyle("#aaaaaa")
                        .fillRect(x*10+2, y*10+2, 6, 6);
                }
            }
        }
    },
    checkLand: function() {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    if (y === 20-1 || this.cells[y+1][x] === 1) {
                        return true;
                    }
                }
            }
        }
    },
    fix: function() {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    this.cells[y][x] = 1;
                }
            }
        }
    },
    checkLines: function() {
        var result = [];
        for (var y = 20-1; y >= 0; y--) {
            var b = true;
            for (var x = 0; x < 10; x++) {
                b = b && this.cells[y][x] === 1;
            }
            if (b) {
                result.push(y);
            }
        }
        return result;
    },
    eraseLine: function(row) {
        for (var x = 0; x < 10; x++) {
            this.cells[row][x] = 0;
        }
        for (var y = 20-2; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (y > row) {
                    this.cells[y+1][x] = this.cells[y][x];
                    this.cells[y][x] = 0;
                }
            }
        }
    },
    fall: function() {
        for (var y = 20-2; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    this.cells[y+1][x] = 2;
                    this.cells[y][x] = 0;
                }
            }
        }
        this.position.y += 1;
    },
    next: function() {
        this.position.x = 3;
        this.position.y = 0;
        var d = this.current = data.random().clone();
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (d[y][x] === 0) {
                    continue;
                }
                if (this.cells[this.position.y + y][this.position.x + x] === 1) {
                    return false;
                }
                this.cells[this.position.y + y][this.position.x + x] = d[y][x];
            }
        }
        return true;
    },
    moveLeft: function() {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    if (x === 0 || this.cells[y][x-1] === 1) {
                        return;
                    }
                }
            }
        }
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    this.cells[y][x-1] = 2;
                    this.cells[y][x] = 0;
                }
            }
        }
        this.position.x -= 1;
    },
    moveRight: function() {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    if (x === 10-1 || this.cells[y][x+1] === 1) {
                        return;
                    }
                }
            }
        }
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 10-1; x >= 0; x--) {
                if (this.cells[y][x] === 2) {
                    this.cells[y][x+1] = 2;
                    this.cells[y][x] = 0;
                }
            }
        }
        this.position.x += 1;
    },
    turnLeft: function() {
        var n = [[],[],[],[]];
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                n[4 - x][y] = this.current[y][x];
            }
        }
    },
    turnRight: function() {

    }
});

var data = [
    [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 2, 2, 0],
        [0, 2, 2, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [2, 2, 2, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 2, 0],
        [2, 2, 2, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 2, 2, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 2, 2, 0],
        [2, 2, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [2, 2, 0, 0],
        [0, 2, 2, 0],
        [0, 0, 0, 0],
    ],
];