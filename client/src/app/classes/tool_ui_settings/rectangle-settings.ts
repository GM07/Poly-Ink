import { ToolSettings } from './tool-settings';
import { RectangleToolConstants } from './tools.constants';

export class RectangleSettings implements ToolSettings {
    readonly TOOL_ID: string = RectangleToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = RectangleToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = RectangleToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = RectangleToolConstants.ICON_NAME;
}
