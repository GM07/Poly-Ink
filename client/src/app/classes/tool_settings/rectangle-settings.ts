import { ToolSettings } from './tool-settings';
import { PencilToolConstants, RectangleToolConstants } from './tools.constants';

export class RectangleSettings implements ToolSettings {
    toolTitle: string = RectangleToolConstants.TOOL_TITLE;
    infoBubble: string = RectangleToolConstants.INFO_BUBBLE;
    iconName: string = PencilToolConstants.ICON_NAME;
}
