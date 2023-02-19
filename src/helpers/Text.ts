import {Text, TextStyle} from "pixi.js";

export function text(text: string, options = {}) {
    const textStyle = new TextStyle({
        fontFamily: 'PixeBoy',
        fontSize: 24,
        fill: 0xffffff,
        align: 'center',
        ...options
    })
    return new Text(text, textStyle);
}