import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class PencilConfig {
    constructor() {
        this.pathData = [[]];
        this.lineWidth = ToolSettingsConst.DEFAULT_PENCIL_WIDTH;
    }

    pathData: Vec2[][];
    lineWidth: number;
}
