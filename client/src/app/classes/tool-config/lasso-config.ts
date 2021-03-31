import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractLineConfig } from './abstract-line-config';
import { SelectionConfig } from './selection-config';

export class LassoConfig extends SelectionConfig implements AbstractLineConfig {
    points: Vec2[];
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    shiftDown: boolean;
    inSelection: boolean;
    intersecting: boolean;

    constructor() {
        super();
        this.points = [];
        this.inSelection = false;
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.width = 0;
        this.height = 0;
        this.shiftDown = false;
        this.intersecting = false;
    }

    clone(): LassoConfig {
        const config = new LassoConfig();
        this.points.forEach((point) => {
            config.points.push(point.clone());
        });
        config.startCoords = this.startCoords.clone();
        config.endCoords = this.endCoords.clone();
        config.shift = this.shift.clone();
        config.originalHeight = this.originalHeight;
        config.height = this.height;
        config.originalWidth = this.originalWidth;
        config.width = this.width;
        config.previewSelectionCtx = null;
        config.inSelection = this.inSelection;
        config.intersecting = this.intersecting;

        for (let i = 0; i < this.SELECTION_DATA.length; ++i) {
            DrawingService.saveCanvas(config.SELECTION_DATA[i], this.SELECTION_DATA[i]);
        }

        return config;
    }
}
