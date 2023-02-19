import {Container, Graphics, Text} from "pixi.js";
import { text } from "../helpers/Text";
import {GameScene} from "./GameScene";
import {GRID_BACKGROUND} from "../constants/Colors";
import {Shape} from "../objects/Shape";
import {GRID_HEIGHT, GRID_WIDTH} from "../constants/Constants";


export class ScoreScene extends Container {
    frameWidth: number = 200
    shapeDisplayHeight: number = 100
    gameScene: GameScene
    score: Text
    level: Text
    padding: number = 15
    nextShape: Shape
    stashShape: Shape
    scoreFrame: Container
    nextFrame: Container
    stashFrame: Container
    controlsFrame: Container

    constructor(gameScene: GameScene) {
        super()
        this.gameScene = gameScene
        this.frameWidth = this.cellWidth() * 7
        this.shapeDisplayHeight = this.cellWidth() * 7
        this.padding = this.cellWidth()
        this.createScoreFrame()
        this.createNextFrame()
        this.createStashFrame()
        this.createControlsFrame()
        this.update()
    }

    createControlsFrame() {
        this.controlsFrame = new Container()
        const frame = new Graphics()
        const posX = GRID_WIDTH * this.cellWidth() + this.frameWidth + this.cellWidth() * 2
        frame.beginFill(GRID_BACKGROUND)
        frame.drawRect(posX, 0, this.frameWidth, this.cellWidth() * GRID_HEIGHT)
        this.controlsFrame.y = 0
        this.controlsFrame.addChild(frame)

        const title = text(
            'Controls\n\n' +
            'Left: A\n' +
            'Right: D\n' +
            'Down: S\n' +
            'Rotate: W\n' +
            'Stash: F\n' +
            'Pause: Enter\n',
            {fontSize: this.cellWidth(), align: 'left', lineHeight: this.cellWidth() * 1.25}
        )
        title.x = posX + this.padding
        title.y = this.padding
        this.controlsFrame.addChild(title)

        this.addChild(this.controlsFrame)
    }

    createScoreFrame() {
        this.scoreFrame = new Container()
        const frame = new Graphics()
        frame.beginFill(GRID_BACKGROUND)
        frame.drawRect(0, 0, this.frameWidth, this.cellWidth() * 4)
        this.scoreFrame.y = this.shapeDisplayHeight * 2 + this.padding * 2
        this.scoreFrame.addChild(frame)
        this.addChild(this.scoreFrame)
    }

    cellWidth() {
        return this.gameScene.cellWidth
    }

    createStashFrame() {
        this.stashFrame = new Container()
        const y = this.shapeDisplayHeight + this.padding
        const frame = new Graphics()
        frame.beginFill(GRID_BACKGROUND)
        frame.drawRect(0, y, this.frameWidth, this.shapeDisplayHeight)
        this.stashFrame.y = 0
        this.stashFrame.addChild(frame)

        const title = text('Stash', {fontSize: this.cellWidth()})
        title.x = this.padding
        title.y = y + this.padding
        this.stashFrame.addChild(title)

        this.addChild(this.stashFrame)
    }

    createNextFrame() {
        this.nextFrame = new Container()
        const frame = new Graphics()
        frame.beginFill(GRID_BACKGROUND)
        frame.drawRect(0, 0, this.frameWidth, this.shapeDisplayHeight)
        this.nextFrame.y = 0
        this.nextFrame.addChild(frame)

        const title = text('Next', {fontSize: this.cellWidth()})
        title.x = this.padding
        title.y = this.padding
        this.nextFrame.addChild(title)

        this.addChild(this.nextFrame)
    }

    updateScore() {
        this.scoreFrame.removeChild(this.score)
        this.score = text('Score  ' + this.gameScene.score.toString(), {
            fontSize: this.cellWidth(),
        })
        this.score.x = this.padding
        this.score.y = this.padding
        this.scoreFrame.addChild(this.score)
    }

    updateLevel() {
        this.scoreFrame.removeChild(this.level)
        this.level = text('Level  ' + this.gameScene.level.toString(), {
            fontSize: this.cellWidth(),
        })
        this.level.x = this.padding
        this.level.y = this.padding + 48
        this.scoreFrame.addChild(this.level)
    }

    updateNextShape(nextShape: number[][], color: string) {
        this.nextFrame.removeChild(this.nextShape)
        this.nextShape = new Shape(
            this.gameScene.grid,
            this.gameScene.assetStore,
            nextShape,
            color
        )
        this.nextFrame.addChild(this.nextShape)
        this.nextShape.x = this.frameWidth / 2 - this.nextShape.width / 2
        this.nextShape.y = this.shapeDisplayHeight / 2 - this.nextShape.height / 2 + this.cellWidth()
    }

    updateStashShape(stashShape: number[][], color: string) {
        this.stashFrame.removeChild(this.stashShape)
        this.stashShape = new Shape(
            this.gameScene.grid,
            this.gameScene.assetStore,
            stashShape,
            color
        )
        this.stashFrame.addChild(this.stashShape)
        this.stashShape.x = this.frameWidth / 2 - this.stashShape.width / 2
        this.stashShape.y = this.shapeDisplayHeight + this.padding + this.shapeDisplayHeight / 2 - this.stashShape.height / 2 + this.cellWidth()
    }

    update() {
        this.updateLevel()
        this.updateScore()
    }
}