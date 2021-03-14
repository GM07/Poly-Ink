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
}
