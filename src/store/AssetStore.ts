import {BaseTexture, ISpritesheetData, Sprite, Spritesheet, TilingSprite} from "pixi.js";
import {SPRITES} from "../constants/Shapes";

export class AssetStore {
    spritesheets: {[key: string]: Spritesheet} = {}

    async load() {
        const spritesheet = new Spritesheet(BaseTexture.from('img/square.png'), SPRITES as ISpritesheetData)
        await spritesheet.parse()

        this.spritesheets['square'] = spritesheet
    }

    getSprite(type: string, name: string) {
        return new Sprite(this.spritesheets[type].textures[name])
    }
}
