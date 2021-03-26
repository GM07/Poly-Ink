import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    shift: ShiftKey;
    startCoords: Vec2;
    endCoords: Vec2;
    scaleFactor: Vec2;
    originalHeight: number;
    height: number;
    originalWidth: number;
    width: number;
    selectionCtx: CanvasRenderingContext2D | null;

    constructor() {
        this.startCoords = { x: 0, y: 0 } as Vec2;
        this.endCoords = { x: 0, y: 0 } as Vec2;
        this.scaleFactor = { x: 1, y: 1 } as Vec2;
        this.originalHeight = 0;
        this.height = 0;
        this.originalWidth = 0;
        this.width = 0;
        this.shift = new ShiftKey();
        this.selectionCtx = null;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y } as Vec2;
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y } as Vec2;
        config.scaleFactor = { x: this.scaleFactor.x, y: this.scaleFactor.y } as Vec2;
        config.shift = this.shift.clone();
        config.originalHeight = this.originalHeight;
        config.height = this.height;
        config.originalWidth = this.originalWidth;
        config.width = this.width;
        config.selectionCtx = null;

        return config;
    }

    didChange(): boolean {
        return (
            this.startCoords.x !== this.endCoords.x ||
            this.startCoords.y !== this.endCoords.y ||
            this.width !== this.originalWidth ||
            this.height !== this.originalHeight
        );
    }
}
