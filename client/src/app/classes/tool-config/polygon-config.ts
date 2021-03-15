import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum PolygonMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class PolygonConfig {
    lineWidth: number = ToolSettingsConst.MIN_WIDTH;
    polygonMode: PolygonMode = PolygonMode.FilledWithContour;
    startCoords: Vec2;
    endCoords: Vec2;
    numEdges: number = ToolSettingsConst.MIN_NUM_EDGES;
    showPerimeter: boolean = false;

    clone(): PolygonConfig {
        let config = new PolygonConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.polygonMode = this.polygonMode;
        config.numEdges = this.numEdges;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;

        return config;
    }
}
