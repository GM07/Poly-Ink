import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export enum RectangleMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class RectangleConfig {
    lineWidth: number = ToolSettingsConst.MIN_WIDTH;
    rectangleMode: RectangleMode = RectangleMode.FilledWithContour;
    startCoords: Vec2 = { x: 0, y: 0 };
    endCoords: Vec2 = { x: 0, y: 0 };
    shiftDown: boolean = false;

    clone(): RectangleConfig {
        const config = new RectangleConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.rectangleMode = this.rectangleMode;
        config.shiftDown = this.shiftDown;
        config.lineWidth = this.lineWidth;

        return config;
    }
}
