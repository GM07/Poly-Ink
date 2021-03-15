import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class LineConfig {
    showJunctionPoints: boolean = true;
    closedLoop: boolean = false;
    diameterJunctions: number = ToolSettingsConst.DEFAULT_LINE_JUNCTION_WIDTH;
    thickness: number = ToolSettingsConst.DEFAULT_LINE_WIDTH;
    points: Vec2[] = [];

    clone(): LineConfig {
        const config = new LineConfig();
        config.closedLoop = this.closedLoop;
        config.diameterJunctions = this.diameterJunctions;
        config.thickness = this.thickness;
        config.showJunctionPoints = this.showJunctionPoints;
        this.points.forEach((point) => {
            config.points.push({ x: point.x, y: point.y });
        });

        return config;
    }
}
