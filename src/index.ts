import {Application, autoDetectRenderer, Sprite, TilingSprite} from 'pixi.js'
import WebFont from 'webfontloader';
import {GameScene} from "./scenes/GameScene";
import {SCREEN_BACKGROUND} from "./constants/Colors";
import {AssetStore} from "./store/AssetStore";

WebFont.load({
    custom: {
        families: ['PixeBoy']
    },
    active: function () {
        initApp()
    }
});

async function initApp() {
    const app = new Application({
        view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: SCREEN_BACKGROUND,
        resizeTo: window
    });

    const [w, h] = [1920, 1080]

    const assetStore = new AssetStore()
    await assetStore.load()

    let gameScene = new GameScene(app, assetStore)

    const bgSprite = Sprite.from('img/bg.png')

    const bg = new TilingSprite(bgSprite.texture, w, h)
    bg.tileScale = {x: gameScene.cellWidth / 100, y: gameScene.cellWidth / 100}
    app.stage.addChild(bg)

    app.stage.addChild(gameScene)

    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    app.ticker.add((delta) => {
        // Add the time to our total elapsed time
        elapsed += delta;
        gameScene.update()
    });


}

