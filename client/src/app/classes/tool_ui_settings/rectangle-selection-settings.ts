import { ToolSettings } from './tool-settings';
import { RectangleSelectionToolConstants } from './tools.constants';

export class RectangleSelectionSettings implements ToolSettings {
    readonly TOOL_ID: string = RectangleSelectionToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = RectangleSelectionToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = RectangleSelectionToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = RectangleSelectionToolConstants.ICON_NAME;
}
