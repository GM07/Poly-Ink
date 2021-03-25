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
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.height = 0;
        this.width = 0;
        this.shift = new ShiftKey();
        this.selectionCtx = null;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = new Vec2(this.startCoords.x, this.startCoords.y);
        config.endCoords = new Vec2(this.endCoords.x, this.endCoords.y);
        config.shift = this.shift.clone();
        config.height = this.height;
        config.width = this.width;
        config.selectionCtx = null;

        return config;
    }
}
