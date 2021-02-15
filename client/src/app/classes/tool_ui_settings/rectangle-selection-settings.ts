import { ToolSettings } from './tool-settings';
import { RectangleSelectionToolConstants } from './tools.constants';

export class RectangleSelectionSettings implements ToolSettings {
    toolId: string = RectangleSelectionToolConstants.TOOL_ID;
    toolTitle: string = RectangleSelectionToolConstants.TOOL_TITLE;
    infoBubble: string = RectangleSelectionToolConstants.INFO_BUBBLE;
    iconName: string = RectangleSelectionToolConstants.ICON_NAME;
}
