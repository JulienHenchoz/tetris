import {text} from "../helpers/Text";
import {Container, Sprite, Text} from "pixi.js";
import {GameScene} from "./GameScene";

export class MenuScene extends Container {
    running: boolean
    text: Text
    gameOver: boolean
    gameScene: GameScene

    constructor(gameScene:GameScene, {gameOver, paused}: { gameOver: boolean, paused: boolean} = {gameOver: false, paused: false}) {
        super()
        this.gameScene = gameScene
        this.gameOver = gameOver
        this.running = true

        const logoContainer = new Container()
        const logo = Sprite.from('img/ideative.png')
        logo.width = this.gameScene.cellWidth * 1.5
        logo.height = logo.width / 1.79
        //logo.height = logo.width / logoRatio
        logo.y = -30
        logo.x = 0
        const logoText = text('Ideatris', {fontSize: this.gameScene.cellWidth, align: 'center'})
        logoText.y = logo.y
        logoText.x = logo.width + this.gameScene.cellWidth / 2
        logoContainer.addChild(logoText)
        logoContainer.addChild(logo)

        this.addChild(logoContainer)

        if (paused) {
            this.text = text('\nPaused', {
                fontSize: this.gameScene.cellWidth,
            })
        }
        else {
            this.text = text((this.gameOver ? '\nGame over!\n' : '') + '\nPress SPACE \nto start', {
                fontSize: this.gameScene.cellWidth,
            })
        }
        this.text.x = this.width / 2 - this.text.width / 2
        this.addChild(this.text)
        addEventListener('keydown', (e) => this.pollEvents(e))
    }

    override destroy() {
        super.destroy()
        removeEventListener('keydown', (e) => this.pollEvents(e))
    }

    pollEvents(e: any) {
        if (e.code == 'Space') {
            this.running = false
        }
    }
}
