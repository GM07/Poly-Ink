import { ToolSettings } from './tool-settings';
import { UndoConstants } from './tools.constants';

export class Undo implements ToolSettings {
    readonly toolId: string = UndoConstants.TOOL_ID;
    readonly toolTitle: string = UndoConstants.TOOL_TITLE;
    readonly infoBubble: string = UndoConstants.INFO_BUBBLE;
    readonly iconName: string = UndoConstants.ICON_NAME;
}
