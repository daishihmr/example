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

        this.canvas.setFillStyle("white");
        this.canvas.clearColor("black");

        this.blocks = Blocks(this);
        this.currentScene.addChild(this.blocks);
    },
    blocks: null,
    update: function() {
        if (this.frame % 5 === 0) {
            if (this.blocks.checkLand()) {
                this.blocks.fix();
                var checkResult = this.blocks.check();
                for (var i = 0; i < checkResult.length; i++) {
                    this.blocks.eraseRow(checkResult[i]);
                }
                var result = this.blocks.next();
                if (!result) {
                    this.gameover();
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
                    canvas.fillRect(x*10, y*10, 10, 10);
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
    check: function() {
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
    eraseRow: function(row) {
        for (var x = 0; x < 10; x++) {
            this.cells[row][x] = 0;
        }
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (y > row) {
                    this.cells[y+1][x] = this.cells[y][x];
                    this.cells[y][x] = 0;
                }
            }
        }
    },
    fall: function() {
        for (var y = 20-1; y >= 0; y--) {
            for (var x = 0; x < 10; x++) {
                if (this.cells[y][x] === 2) {
                    this.cells[y+1][x] = 2;
                    this.cells[y][x] = 0;
                }
            }
        }
    },
    next: function() {
        var d = data.random();
        for (var i = 0; i < d.length; i++) {
            if (this.cells[d[i].y][d[i].x] === 1) {
                return false;
            }
            this.cells[d[i].y][d[i].x] = 2;
        }
        return true;
    }
});

var data = [
    [
        { x: 4, y: 0},
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 7, y: 0},
    ],
    [
        { x: 4, y: 0},
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 5, y: 1},
    ],
    [
        { x: 4, y: 0},
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 6, y: 1},
    ],
    [
        { x: 4, y: 0},
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 4, y: 1},
    ],
    [
        { x: 4, y: 0},
        { x: 5, y: 0},
        { x: 5, y: 1},
        { x: 6, y: 1},
    ],
    [
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 4, y: 1},
        { x: 5, y: 1},
    ],
    [
        { x: 5, y: 0},
        { x: 6, y: 0},
        { x: 5, y: 1},
        { x: 6, y: 1},
    ],
];