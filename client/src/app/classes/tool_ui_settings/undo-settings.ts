import { ToolSettings } from './tool-settings';
import { UndoConstants } from './tools.constants';

export class Undo implements ToolSettings {
    toolId: string = UndoConstants.TOOL_ID;
    toolTitle: string = UndoConstants.TOOL_TITLE;
    infoBubble: string = UndoConstants.INFO_BUBBLE;
    iconName: string = UndoConstants.ICON_NAME;
}
