import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum ShapeMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class ShapeConfig {
    startCoords: Vec2 = { x: 0, y: 0 };
    endCoords: Vec2 = { x: 0, y: 0 };
    shapeMode: ShapeMode = ShapeMode.FilledWithContour;
    shiftDown: boolean = false;
    lineWidth: number = ToolSettingsConst.MIN_WIDTH;
    showPerimeter: boolean = false;

    clone(): ShapeConfig {
        const config = new ShapeConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shapeMode = this.shapeMode;
        config.shiftDown = this.shiftDown;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;

        return config;
    }
}
