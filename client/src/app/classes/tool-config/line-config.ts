import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class LineConfig {
    showJunctionPoints: boolean;
    closedLoop: boolean;
    diameterJunctions: number;
    thickness: number;
    points: Vec2[];

    constructor() {
        this.showJunctionPoints = true;
        this.closedLoop = false;
        this.diameterJunctions = ToolSettingsConst.DEFAULT_LINE_JUNCTION_WIDTH;
        this.thickness = ToolSettingsConst.DEFAULT_LINE_WIDTH;
        this.points = [];
    }

    clone(): LineConfig {
        const config = new LineConfig();
        config.closedLoop = this.closedLoop;
        config.diameterJunctions = this.diameterJunctions;
        config.thickness = this.thickness;
        config.showJunctionPoints = this.showJunctionPoints;
        this.points.forEach((point) => {
            config.points.push({ x: point.x, y: point.y } as Vec2);
        });

        return config;
    }
}
