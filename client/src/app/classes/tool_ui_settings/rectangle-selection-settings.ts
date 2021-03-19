import { ToolSettings } from './tool-settings';
import { RectangleSelectionToolConstants } from './tools.constants';

export class RectangleSelectionSettings implements ToolSettings {
    readonly toolId: string = RectangleSelectionToolConstants.TOOL_ID;
    readonly toolTitle: string = RectangleSelectionToolConstants.TOOL_TITLE;
    readonly infoBubble: string = RectangleSelectionToolConstants.INFO_BUBBLE;
    readonly iconName: string = RectangleSelectionToolConstants.ICON_NAME;
}
