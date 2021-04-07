import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractLineConfig } from './abstract-line-config';
import { SelectionConfig } from './selection-config';

export class LassoConfig extends SelectionConfig implements AbstractLineConfig {
    points: Vec2[];
    originalPoints: Vec2[];
    isInSelection: boolean;
    intersecting: boolean;

    constructor() {
        super();
        this.points = [];
        this.originalPoints = [];
        this.isInSelection = false;
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.width = 0;
        this.height = 0;
        this.intersecting = false;
    }

    clone(): LassoConfig {
        const config = new LassoConfig();
        this.points.forEach((point) => {
            config.points.push(point.clone());
        });
        this.originalPoints.forEach((point) => {
            config.originalPoints.push(point.clone());
        });
        config.startCoords = this.startCoords.clone();
        config.endCoords = this.endCoords.clone();
        config.shift = this.shift.clone();
        config.originalHeight = this.originalHeight;
        config.height = this.height;
        config.originalWidth = this.originalWidth;
        config.width = this.width;
        config.previewSelectionCtx = null;
        config.isInSelection = this.isInSelection;
        config.intersecting = this.intersecting;
        config.markedForDelete = this.markedForDelete;
        config.markedForPaste = this.markedForPaste;
        config.scaleFactor = this.scaleFactor;

        DrawingService.saveCanvas(config.SELECTION_DATA, this.SELECTION_DATA);

        return config;
    }
}
