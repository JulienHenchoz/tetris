import {GRID_HEIGHT, GRID_WIDTH} from "../constants/Constants";
import {Container, Graphics, Sprite} from 'pixi.js'
import {GRID_BACKGROUND} from "../constants/Colors";
import {Shape} from "./Shape";
import {debugGrid} from "../helpers/Debug";

export class Grid extends Container {
    cells: Sprite[][]
    cellWidth: number
    offsetX: number
    offsetY: number
    frame?: Graphics

    constructor(cellWidth: number, offsetX: number, offsetY: number) {
        super()
        this.cells = []
        this.x = offsetX
        this.y = offsetY
        this.cellWidth = cellWidth

        this.initGrid()
        this.createFrame()

        this.draw()
    }

    initGrid() {
        this.cells = []
        const tmpCells = []
        for (let y = 0 ; y < GRID_HEIGHT ; y++) {
            tmpCells.push([])
            for (let x = 0 ; x < GRID_WIDTH ; x++) {
                tmpCells[y].push(null)
            }
        }
        this.cells = tmpCells
    }

    addShape(shape: Shape) {
        for (let y = 0 ; y < shape.cells.length ; y++) {
            for (let x = 0 ; x < shape.cells[y].length ; x++) {
                const cell = shape.cells[y][x]
                if (cell) {
                    this.cells[y + shape.posY][x + shape.posX] = cell
                    cell.x = (x + shape.posX) * this.cellWidth
                    cell.y = (y + shape.posY) * this.cellWidth
                    this.addChild(cell)
                }
            }
        }
    }

    createFrame() {
        this.removeChild(this.frame)
        this.frame = new Graphics();
        this.frame.beginFill(GRID_BACKGROUND);
        this.frame.drawRect(0, 0, this.cellWidth * GRID_WIDTH, this.cellWidth * GRID_HEIGHT);
        this.addChild(this.frame)
    }

    getLines() {
        const lines = []
        for (let y = 0 ; y < GRID_HEIGHT ; y++) {
            let all1 = true
            for (let x = 0 ; x < GRID_WIDTH ; x++) {
                if (!this.cells[y][x]) {
                    all1 = false
                }
            }
            if (all1) {
                lines.push(y)
            }
        }
        return lines
    }

    clearLines(lines: number[]) {
        for (let y of lines) {
            for (let x = 0 ; x < GRID_WIDTH ; x++) {
                this.removeChild(this.cells[y][x])
                this.cells[y][x] = null
            }
        }
    }

    shiftDown() {
        let changed = true
        while (changed) {
            changed = false
            for (let y = 0 ; y < GRID_HEIGHT - 1 ; y++) {
                const currentLineEmpty = this.cells[y].every(cell => !cell)
                const isNextLineEmpty = y < GRID_HEIGHT - 1  && this.cells[y + 1].every(cell => !cell)
                if (!currentLineEmpty && isNextLineEmpty) {
                    for (let x = 0 ; x < GRID_WIDTH ; x++) {
                        if (this.cells[y][x]) {
                            this.cells[y + 1][x] = this.cells[y][x]
                            this.cells[y + 1][x].x = x * this.cellWidth
                            this.cells[y + 1][x].y = (y + 1) * this.cellWidth
                            this.cells[y][x] = null
                            console.log("OUI")
                        }
                    }
                    changed = true
                }
            }
        }
    }

    isGameOver() {
        return this.cells[0].some(cell => !!cell)
    }

    draw() {
        this.x = this.offsetX
        this.y = this.offsetY
        this.width = this.cellWidth * GRID_WIDTH
        this.height = this.cellWidth * GRID_HEIGHT

        this.frame.clear()
        this.frame.beginFill(GRID_BACKGROUND);
        this.frame.drawRect(0, 0, this.cellWidth * GRID_WIDTH, this.cellWidth * GRID_HEIGHT);

    }


}