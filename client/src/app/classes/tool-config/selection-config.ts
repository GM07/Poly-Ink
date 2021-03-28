import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    shiftDown: boolean;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.height = 0;
        this.width = 0;
        this.shiftDown = false;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = new Vec2(this.startCoords.x, this.startCoords.y);
        config.endCoords = new Vec2(this.endCoords.x, this.endCoords.y);
        config.shiftDown = this.shiftDown;
        config.height = this.height;
        config.width = this.width;

        return config;
    }
}
