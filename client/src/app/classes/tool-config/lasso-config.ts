import { Vec2 } from '../vec2';
import { AbstractLineConfig } from './abstract-line-config';

export class LassoConfig extends AbstractLineConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    shiftDown: boolean;

    constructor() {
        super();
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.width = 0;
        this.height = 0;
        this.shiftDown = false;
    }

    clone(): LassoConfig {
        const config = new LassoConfig();
        this.points.forEach((point) => {
            config.points.push(point.clone());
        });
        config.startCoords = this.startCoords.clone();
        config.endCoords = this.endCoords.clone();
        config.width = this.width;
        config.height = this.height;
        config.shiftDown = this.shiftDown;
        return config;
    }
}
