import { ToolSettings } from './tool-settings';
import { RectangleToolConstants } from './tools.constants';

export class RectangleSettings implements ToolSettings {
    readonly toolId: string = RectangleToolConstants.TOOL_ID;
    readonly toolTitle: string = RectangleToolConstants.TOOL_TITLE;
    readonly infoBubble: string = RectangleToolConstants.INFO_BUBBLE;
    readonly iconName: string = RectangleToolConstants.ICON_NAME;
}
