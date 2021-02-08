import { ToolSettings } from './tool-settings';
import { RectangleToolConstants } from './tools.constants';

export class RectangleSettings implements ToolSettings {
    toolId: string = RectangleToolConstants.TOOL_ID;
    toolTitle: string = RectangleToolConstants.TOOL_TITLE;
    infoBubble: string = RectangleToolConstants.INFO_BUBBLE;
    iconName: string = RectangleToolConstants.ICON_NAME;
}
