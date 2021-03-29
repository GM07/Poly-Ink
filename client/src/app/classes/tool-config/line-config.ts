import { AbstractLineConfig } from '@app/classes/tool-config/abstract-line-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class LineConfig implements AbstractLineConfig {
    points: Vec2[];
    showJunctionPoints: boolean;
    closedLoop: boolean;
    diameterJunctions: number;
    thickness: number;

    constructor() {
        this.points = [];
        this.showJunctionPoints = true;
        this.closedLoop = false;
        this.diameterJunctions = ToolSettingsConst.DEFAULT_LINE_JUNCTION_WIDTH;
        this.thickness = ToolSettingsConst.DEFAULT_LINE_WIDTH;
    }

    clone(): LineConfig {
        const config = new LineConfig();
        config.closedLoop = this.closedLoop;
        config.diameterJunctions = this.diameterJunctions;
        config.thickness = this.thickness;
        config.showJunctionPoints = this.showJunctionPoints;
        this.points.forEach((point) => {
            config.points.push(new Vec2(point.x, point.y));
        });

        return config;
    }
}
