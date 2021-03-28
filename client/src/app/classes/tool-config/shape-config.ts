import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum ShapeMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class ShapeConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    shapeMode: ShapeMode;
    shiftDown: boolean;
    lineWidth: number;
    showPerimeter: boolean;
    numEdges: number;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.endCoords = new Vec2(0, 0);
        this.shapeMode = ShapeMode.FilledWithContour;
        this.shiftDown = false;
        this.lineWidth = ToolSettingsConst.MIN_WIDTH;
        this.showPerimeter = false;
        this.numEdges = ToolSettingsConst.MIN_NUM_EDGES;
    }

    clone(): ShapeConfig {
        const config = new ShapeConfig();
        config.startCoords = new Vec2(this.startCoords.x, this.startCoords.y);
        config.endCoords = new Vec2(this.endCoords.x, this.endCoords.y);
        config.shapeMode = this.shapeMode;
        config.shiftDown = this.shiftDown;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;
        config.numEdges = this.numEdges;

        return config;
    }
}
