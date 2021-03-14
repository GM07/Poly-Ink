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
    startCoords: Vec2;
    endCoords: Vec2;
    shiftDown: boolean = false;
}
