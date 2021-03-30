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
    markedForDelete: boolean;
    selectionCtx: CanvasRenderingContext2D | null;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.scaleFactor = new Vec2(1, 1);
        this.originalHeight = 0;
        this.height = 0;
        this.originalWidth = 0;
        this.width = 0;
        this.shift = new ShiftKey();
        this.selectionCtx = null;
        this.markedForDelete = false;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = this.startCoords.clone();
        config.endCoords = this.endCoords.clone();
        config.scaleFactor = this.scaleFactor.clone();
        config.shift = this.shift.clone();
        config.originalHeight = this.originalHeight;
        config.height = this.height;
        config.originalWidth = this.originalWidth;
        config.width = this.width;
        config.selectionCtx = null;
        config.markedForDelete = this.markedForDelete;

        return config;
    }

    didChange(): boolean {
        return (
            !this.startCoords.equals(this.endCoords) ||
            this.width !== this.originalWidth ||
            this.height !== this.originalHeight ||
            this.markedForDelete
        );
    }
}
