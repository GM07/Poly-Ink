import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export enum PolygonMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

export class PolygonConfig {
    lineWidth: number;
    polygonMode: PolygonMode;
    startCoords: Vec2;
    endCoords: Vec2;
    numEdges: number;
    showPerimeter: boolean;

    constructor() {
        this.lineWidth = ToolSettingsConst.MIN_WIDTH;
        this.polygonMode = PolygonMode.FilledWithContour;
        this.startCoords = { x: 0, y: 0 };
        this.endCoords = { x: 0, y: 0 };
        this.numEdges = ToolSettingsConst.MIN_NUM_EDGES;
        this.showPerimeter = false;
    }

    clone(): PolygonConfig {
        const config = new PolygonConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.polygonMode = this.polygonMode;
        config.numEdges = this.numEdges;
        config.lineWidth = this.lineWidth;
        config.showPerimeter = this.showPerimeter;

        return config;
    }
}
