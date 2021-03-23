import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    shiftDown: boolean;
    selectionCtx: CanvasRenderingContext2D | null;

    constructor() {
        this.startCoords = { x: 0, y: 0 };
        this.endCoords = { x: 0, y: 0 };
        this.height = 0;
        this.width = 0;
        this.shiftDown = false;
        this.selectionCtx = null;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shiftDown = this.shiftDown;
        config.height = this.height;
        config.width = this.width;

        return config;
    }
}
