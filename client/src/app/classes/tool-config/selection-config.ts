import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class SelectionConfig {
    readonly SELECTION_DATA: HTMLCanvasElement;

    shift: ShiftKey;
    startCoords: Vec2;
    endCoords: Vec2;
    originalHeight: number;
    height: number;
    originalWidth: number;
    width: number;
    previewSelectionCtx: CanvasRenderingContext2D | null;
    scaleFactor: Vec2;
    markedForDelete: boolean;
    markedForPaste: boolean;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.scaleFactor = new Vec2(1, 1);
        this.originalHeight = 0;
        this.height = 0;
        this.originalWidth = 0;
        this.width = 0;
        this.shift = new ShiftKey();
        this.markedForDelete = false;
        this.markedForPaste = false;

        this.SELECTION_DATA = document.createElement('canvas');
        this.previewSelectionCtx = null;
    }

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = this.startCoords.clone();
        config.endCoords = this.endCoords.clone();
        config.shift = this.shift.clone();
        config.scaleFactor = this.scaleFactor.clone();
        config.originalHeight = this.originalHeight;
        config.height = this.height;
        config.originalWidth = this.originalWidth;
        config.width = this.width;
        config.markedForDelete = this.markedForDelete;
        config.markedForPaste = this.markedForPaste;

        DrawingService.saveCanvas(config.SELECTION_DATA, this.SELECTION_DATA);

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
