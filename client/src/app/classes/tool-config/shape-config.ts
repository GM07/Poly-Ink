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
        this.startCoords = { x: 0, y: 0 };
        this.endCoords = { x: 0, y: 0 };
        this.shapeMode = ShapeMode.FilledWithContour;
        this.shiftDown = false;
        this.lineWidth = ToolSettingsConst.MIN_WIDTH;
        this.showPerimeter = false;
        this.numEdges = ToolSettingsConst.MIN_NUM_EDGES;
    }

    clone(): ShapeConfig {
        const config = new ShapeConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shapeMode = this.shapeMode;
        config.shiftDown = this.shiftDown;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;
        config.numEdges = this.numEdges;

        return config;
    }
}
