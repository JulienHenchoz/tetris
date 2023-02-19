import {Grid} from "../objects/Grid";
import {Sprite} from "pixi.js";

export function debugGrid(cells: Sprite[][]): void {
    const gridStr = cells.map(row => row.map(cell => cell ? '1' : '0').join(''))
    console.log(gridStr.join('\n'))
}
