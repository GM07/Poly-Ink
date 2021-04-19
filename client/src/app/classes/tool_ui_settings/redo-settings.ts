import { ToolSettings } from './tool-settings';
import { RedoConstants } from './tools.constants';

export class Redo implements ToolSettings {
    readonly TOOL_ID: string = RedoConstants.TOOL_ID;
    readonly TOOL_TITLE: string = RedoConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = RedoConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = RedoConstants.ICON_NAME;
}
