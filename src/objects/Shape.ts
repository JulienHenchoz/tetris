import {Container, Sprite} from "pixi.js";
import {SHAPES} from "../constants/Shapes";
import {AssetStore} from "../store/AssetStore";
import {Grid} from "./Grid";
import {GRID_HEIGHT, GRID_WIDTH} from "../constants/Constants";
import {debugGrid} from "../helpers/Debug";

export class Shape extends Container {
    cells: Sprite[][]
    shape: number[][]
    color: string
    grid: Grid
    posX: number = 0
    posY: number = 0

    constructor(grid: Grid, assetStore: AssetStore, shape: number[][] = null, color: string = null) {
        super()
        const randomShape = this.getRandomShape()
        if (!shape) {
            this.shape = randomShape.shape
            this.color = randomShape.color
        }
        else {
            this.shape = shape
            this.color = color
        }
        this.grid = grid
        this.cells = []
        for (let y = 0; y < this.shape.length; y++) {
            this.cells.push([])
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x] > 0) {
                    const cell = assetStore.getSprite('square', this.color)
                    this.cells[y][x] = this.repositionCell(x, y, cell)
                    this.addChild(this.cells[y][x])
                }
                else {
                    this.cells[y][x] = null
                }
            }
        }
        this.posX = GRID_WIDTH / 2 - Math.ceil(this.cells[0].length / 2)
        this.draw()
    }

    repositionCell(x: number, y: number, cell: Sprite) {
        cell.width = this.grid.cellWidth
        cell.height = this.grid.cellWidth
        cell.x = x * this.grid.cellWidth
        cell.y = y * this.grid.cellWidth
        return cell
    }

    moveDown() {
        if (this.canMoveTo(0,1)) {
            this.posY++
            this.draw()
            return true
        }
        return false
    }

    moveLeft() {
        if (this.canMoveTo(-1,0)) {
            this.posX--
            this.draw()
            return true
        }
        return false
    }

    moveRight() {
        if (this.canMoveTo(1,0)) {
            this.posX++
            this.draw()
            return true
        }
        return false
    }

    rotateMatrix(matrix: any): [][] {
        let result: any[] = []
        matrix.forEach(function (a: any, i: any, aa: any) {
            a.forEach(function (b: any, j: any, bb: any) {
                result[j] = result[j] || [];
                result[j][aa.length - i - 1] = b;
            });
        });
        return result;
    }

    rotate() {
        const tmpShape = this.rotateMatrix(this.cells)
        const tmpCells = this.rotateMatrix(this.shape)

        if (this.posX + tmpCells[0].length > GRID_WIDTH) {
            this.posX -= this.posX + tmpCells[0].length - GRID_WIDTH
        }
        if (this.posY + tmpCells.length > GRID_HEIGHT) {
            this.posY -= this.posY + tmpCells.length - GRID_HEIGHT
        }

        if (!this.collides(this.posX, this.posY, tmpCells)) {
            this.shape = tmpCells
            this.cells = tmpShape
            this.resize()
        }
    }

    dropDown() {

    }

    collides(posX: number, posY: number, shape: number[][]): boolean {
        let width = shape[0].length
        let height = shape.length
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (posX + x >= GRID_WIDTH) {
                    return true
                }
                if (posY + y >= GRID_HEIGHT) {
                    return true
                }
                if (shape[y][x] > 0) {
                    if (this.grid.cells[posY + y][posX + x] !== null) {
                        return true
                    }
                }
            }
        }
        return false
    }

    canMoveTo(offsetX: number, offsetY: number) {
        const newPosX = this.posX + offsetX
        const newPosY = this.posY + offsetY

        if (newPosY > GRID_HEIGHT - this.cells.length) {
            return false
        }
        if (newPosX < 0 || newPosX > GRID_WIDTH - this.cells[0].length) {
            return false
        }
        for (let y = 0; y < this.cells.length ; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                if (this.shape[y][x] > 0) {
                    const nextCell = this.grid.cells[y + newPosY][x + newPosX]
                    if (!!nextCell && nextCell.texture) {
                        return false
                    }
                }
            }
        }

        return true
    }

    draw() {
        this.x = this.grid.x + this.posX * this.grid.cellWidth
        this.y = this.grid.y + this.posY * this.grid.cellWidth
        for (let y = 0 ; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                if (this.cells[y][x]) {
                    this.cells[y][x].visible = true
                }
            }
        }
    }

    getRandomShape() {
        return SHAPES[Math.floor(Math.random() * SHAPES.length)]
    }

    resize() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x] > 0) {
                    this.cells[y][x] = this.repositionCell(x, y, this.cells[y][x])
                }
            }
        }
        this.draw()
    }

}