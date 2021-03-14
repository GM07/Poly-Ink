import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum EllipseMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class EllipseConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    ellipseMode: EllipseMode = EllipseMode.FilledWithContour;
    shiftDown: boolean = false;
    lineWidth: number = ToolSettingsConst.MIN_WIDTH;
    showPerimeter: boolean = false;
}
