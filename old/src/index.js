import './App.scss';
import WebFont from 'webfontloader';
import {Application, loadWebFont} from 'pixijs';
import {Game} from "../pixi-hotwire/src/states/Game";


let app = new Application({resizeTo: window});

document.body.appendChild(app.view);
// Magically load the PNG asynchronously
//let sprite = Sprite.from('assets/blue.png')

let game = new Game(app)

let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((delta) => {
    // Add the time to our total elapsed time
    elapsed += delta;
    game.update()
    game.draw(app)
});

