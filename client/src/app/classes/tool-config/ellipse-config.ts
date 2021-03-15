import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum EllipseMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class EllipseConfig {
    startCoords: Vec2 = { x: 0, y: 0 };
    endCoords: Vec2 = { x: 0, y: 0 };
    ellipseMode: EllipseMode = EllipseMode.FilledWithContour;
    shiftDown: boolean = false;
    lineWidth: number = ToolSettingsConst.MIN_WIDTH;
    showPerimeter: boolean = false;

    clone(): EllipseConfig {
        const config = new EllipseConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.ellipseMode = this.ellipseMode;
        config.shiftDown = this.shiftDown;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;

        return config;
    }
}
