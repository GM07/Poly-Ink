import { ToolSettings } from './tool-settings';
import { RedoConstants } from './tools.constants';

export class Redo implements ToolSettings {
    readonly toolId: string = RedoConstants.TOOL_ID;
    readonly toolTitle: string = RedoConstants.TOOL_TITLE;
    readonly infoBubble: string = RedoConstants.INFO_BUBBLE;
    readonly iconName: string = RedoConstants.ICON_NAME;
}
