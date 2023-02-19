import {Grid} from "../objects/Grid";
import {Shape} from "../objects/Shape";
import {text} from "../helpers/Text";
import {Application, Container} from "pixi.js";
import {
    FALL_SPEED_DECREASE,
    GRID_HEIGHT,
    GRID_WIDTH, INITIAL_FALL_SPEED, LEVEL_UP_EVERY,
    SCORE_FOR_LINE,
    SCORE_FOR_MULTIPLE_LINES,
    VERTICAL_MARGIN_PERCENT
} from "../constants/Constants";
import {AssetStore} from "../store/AssetStore";
import {MenuScene} from "./MenuScene";
import {ScoreScene} from "./ScoreScene";

const STATE_RUNNING = 'running'
const STATE_PAUSED = 'paused'
const STATE_GAMEOVER = 'gameover'
const STATE_BEFORE = 'before'


export class GameScene extends Container {
    app: Application
    gridOffsetX: number
    gridOffsetY: number
    grid: Grid
    state?: string
    prevState?: string
    assetStore: AssetStore
    currentShape?: Shape | null
    nextShape?: Shape | null
    stashShape?: Shape | null
    canRotate: boolean = true

    menuScene?: MenuScene
    scoreScene?: ScoreScene

    score: number = 0
    level: number = 1

    fallTimer: number = 0
    fallSpeed: number = INITIAL_FALL_SPEED

    moveTimer: number = 0
    moveSpeed: number = 7

    settleTimer: number = 0
    settleSpeed: number = 50

    verticalMargin: number
    cellWidth: number
    keyDown: string[] = []

    constructor(app: Application, assetStore: AssetStore) {
        super()
        this.app = app
        this.assetStore = assetStore
        this.cellWidth = this.calculateCellWidth()
        this.newGame()
        this.setState(STATE_BEFORE)

        window.onresize = () => this.calculateGridOffset()
        this.initEvents()
        this.positionMenu()
    }

    calculateGridOffset() {
        const nbCellsX = this.app.screen.width / this.cellWidth
        const nbCellsY = this.app.screen.height / this.cellWidth
        this.gridOffsetX = this.cellWidth * Math.floor((nbCellsX - GRID_WIDTH) / 2)
        this.gridOffsetY = this.cellWidth * Math.floor((nbCellsY - GRID_HEIGHT) / 2)
        if (this.grid) {
            this.grid.offsetX = this.gridOffsetX
            this.grid.offsetY = this.gridOffsetY
            this.grid.draw()
        }
        this.positionMenu()
    }

    positionMenu() {
        if (this.menuScene) {
            this.menuScene.position.set(
                this.grid.width / 2 - this.menuScene.width / 2,
                this.grid.height / 2 - this.menuScene.height / 2
            )
        }
        if (this.scoreScene) {
            this.scoreScene.x = this.grid.x - this.scoreScene.frameWidth - this.cellWidth
            this.scoreScene.y = this.grid.y
        }
    }

    initEvents() {
        addEventListener('keydown', (e) => {
            if (!this.keyDown.includes(e.key)) {
                this.keyDown.push(e.key)
            }
        })
        addEventListener('keyup', (e) => {
            this.keyDown = this.keyDown.filter(key => key !== e.key)
            this.canRotate = true

            if (e.key === 'Enter') {
                if (this.state === STATE_PAUSED) {
                    this.setState(STATE_RUNNING)
                } else if (this.state === STATE_RUNNING) {
                    this.setState(STATE_PAUSED)
                }
            }
            if (e.key === 'f') {
                this.stash()
            }
        })
    }

    setState(state: string) {
        this.prevState = this.state
        this.state = state
        switch (this.state) {
            case STATE_BEFORE:
                this.createMenuScene()
                break
            case STATE_RUNNING:
                this.grid.removeChild(this.menuScene)
                this.menuScene = null
                if (this.prevState === STATE_BEFORE || this.prevState === STATE_GAMEOVER) {
                    this.newGame()
                    this.createNewShape()
                }
                break
            case STATE_GAMEOVER:
                this.createGameOverScene()
                break
            case STATE_PAUSED:
                this.createPauseScene()
                break
            default:
                break
        }
    }

    createMenuScene() {
        this.menuScene = new MenuScene(this)
        this.grid.addChild(this.menuScene)
        this.positionMenu()
    }

    createPauseScene() {
        this.menuScene = new MenuScene(this, {gameOver: false, paused: true})
        this.grid.addChild(this.menuScene)
        this.positionMenu()
    }

    createGameOverScene() {
        this.menuScene = new MenuScene(this, {gameOver: true, paused: false})
        this.grid.addChild(this.menuScene)
        this.positionMenu()
    }

    calculateCellWidth() {
        return Math.floor(this.app.screen.height / (GRID_HEIGHT + 2))
    }

    initGrid() {
        return new Grid(this.cellWidth, this.gridOffsetX, this.gridOffsetY)
    }

    newGame(): void {
        this.removeChild(this.grid)
        this.removeChild(this.currentShape)
        this.removeChild(this.nextShape)
        this.removeChild(this.stashShape)
        this.removeChild(this.scoreScene)

        this.currentShape = null
        this.nextShape = null
        this.stashShape = null

        this.scoreScene = new ScoreScene(this)
        this.addChild(this.scoreScene)

        this.grid = this.initGrid()
        this.addChild(this.grid)
        this.calculateGridOffset()
        this.score = 0
        this.level = 1
        this.scoreScene.update()
        this.settleTimer = 0
        this.moveTimer = 0
    }

    createNewShape() {
        this.removeChild(this.currentShape)
        if (this.nextShape) {
            this.currentShape = this.nextShape
        } else {
            this.currentShape = new Shape(this.grid, this.assetStore)
        }
        this.nextShape = new Shape(this.grid, this.assetStore)

        this.scoreScene?.updateNextShape(
            this.nextShape.shape,
            this.nextShape.color
        )
        this.addChild(this.currentShape)
    }

    update() {
        switch (this.state) {
            case STATE_RUNNING:
            case STATE_PAUSED:
                this.updateGame()
                break
            case STATE_BEFORE:
            case STATE_GAMEOVER:
                this.updateMenu()
                break
            default:
                break
        }
    }

    handleInput() {
        this.moveTimer++
        if (this.moveTimer > this.moveSpeed) {
            this.moveTimer = 0
            for (let key in this.keyDown) {
                if (this.state === STATE_RUNNING) {
                    switch (this.keyDown[key]) {
                        case 'a':
                            if (this.currentShape?.moveLeft()) {
                                this.settleTimer = 0
                            }
                            break
                        case 'd':
                            if (this.currentShape?.moveRight()) {
                                this.settleTimer = 0
                            }
                            break
                        case 's':
                            this.currentShape?.moveDown()
                            break
                        case 'w':
                            if (this.canRotate) {
                                this.currentShape?.rotate()
                                this.settleTimer = 0
                                this.canRotate = false
                            }
                            break
                        case ' ':
                            this.currentShape?.dropDown()
                    }
                }
            }
        }
    }

    stash() {
        if (this.stashShape) {
            const tmp = this.stashShape
            const posX = this.currentShape.posX
            const posY = this.currentShape.posY
            const x = this.currentShape.x
            const y = this.currentShape.y

            this.stashShape = this.currentShape
            this.removeChild(this.currentShape)
            this.currentShape = tmp
            this.currentShape.x = x
            this.currentShape.y = y
            this.currentShape.posX = posX
            this.currentShape.posY = posY

            this.addChild(this.currentShape)
        }
        else {
            this.stashShape = this.currentShape
            this.createNewShape()
        }
        this.scoreScene.updateStashShape(
            this.stashShape.shape,
            this.stashShape.color
        )
    }

    updateMenu() {
        if (this.menuScene?.running == false) {
            this.setState(STATE_RUNNING)
            this.grid.removeChild(this.menuScene)
        }
    }

    shapeFall() {
        this.fallTimer++
        if (this.fallTimer > this.fallSpeed) {
            this.fallTimer = 0
            this.currentShape?.moveDown()
        }
    }

    updateGame() {
        if (this.grid.isGameOver()) {
            this.setState(STATE_GAMEOVER)
            return
        }
        if (this.state === STATE_RUNNING) {
            if (!this.currentShape?.canMoveTo(0, 1)) {
                this.settleTimer++
                if (this.settleTimer > this.settleSpeed) {
                    this.grid.addShape(this.currentShape)
                    this.createNewShape()
                    this.settleTimer = 0
                }
            }

            const doneLines = this.grid.getLines()
            if (doneLines.length > 0) {
                this.grid.clearLines(doneLines)
                this.grid.shiftDown()
                this.increaseScore(doneLines.length)
            }

            this.shapeFall()
        }
        this.handleInput()
    }

    increaseScore(doneLines: number) {
        this.score += doneLines * SCORE_FOR_LINE
        if (doneLines > 1) {
            this.score += doneLines * SCORE_FOR_MULTIPLE_LINES
        }

        this.level = Math.floor(this.score / LEVEL_UP_EVERY) + 1
        this.fallSpeed = INITIAL_FALL_SPEED - this.level * FALL_SPEED_DECREASE
        this.scoreScene.update()
    }
}