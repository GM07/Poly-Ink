import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class LineConfig {
    showJunctionPoints: boolean = true;
    closedLoop: boolean = false;
    diameterJunctions: number = ToolSettingsConst.DEFAULT_LINE_JUNCTION_WIDTH;
    thickness: number = ToolSettingsConst.DEFAULT_LINE_WIDTH;
    points: Vec2[] = [];
}
