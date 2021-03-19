import { ToolSettings } from './tool-settings';
import { RedoConstants } from './tools.constants';

export class Redo implements ToolSettings {
    toolId: string = RedoConstants.TOOL_ID;
    toolTitle: string = RedoConstants.TOOL_TITLE;
    infoBubble: string = RedoConstants.INFO_BUBBLE;
    iconName: string = RedoConstants.ICON_NAME;
}
