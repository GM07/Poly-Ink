import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

// TODO - when saving config might need for copy to preserve data
export class PencilConfig {
    pathData: Vec2[][] = [[]];
    lineWidth: number = ToolSettingsConst.DEFAULT_PENCIL_WIDTH;
}
