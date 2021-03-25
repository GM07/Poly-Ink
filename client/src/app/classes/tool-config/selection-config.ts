import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    shift: ShiftKey;
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    selectionCtx: CanvasRenderingContext2D | null;

    constructor() {
        this.startCoords = { x: 0, y: 0 } as Vec2;
        this.endCoords = { x: 0, y: 0 } as Vec2;
        this.height = 0;
        this.width = 0;
        this.shift = new ShiftKey();
        this.selectionCtx = null;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shift = this.shift.clone();
        config.height = this.height;
        config.width = this.width;
        config.selectionCtx = null;

        return config;
    }
}
