import { ToolSettings } from './tool-settings';
import { UndoConstants } from './tools.constants';

export class Undo implements ToolSettings {
    readonly TOOL_ID: string = UndoConstants.TOOL_ID;
    readonly TOOL_TITLE: string = UndoConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = UndoConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = UndoConstants.ICON_NAME;
}
