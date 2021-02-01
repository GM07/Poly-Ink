import { ToolSettings } from './tool-settings';
import { RectangleSelectionToolConstants, RectangleToolConstants } from './tools.constants';

export class RectangleSelectionSettings implements ToolSettings {
    toolId: string = RectangleToolConstants.TOOL_ID;
    toolTitle: string = RectangleSelectionToolConstants.TOOL_TITLE;
    infoBubble: string = RectangleSelectionToolConstants.INFO_BUBBLE;
    iconName: string = RectangleSelectionToolConstants.ICON_NAME;
}
