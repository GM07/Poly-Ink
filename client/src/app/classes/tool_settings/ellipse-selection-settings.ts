import { ToolSettings } from './tool-settings';
import { EllipseSelectionToolConstants } from './tools.constants';

export class EllipseSelectionSettings implements ToolSettings {
    toolId: string = EllipseSelectionToolConstants.TOOL_ID;
    toolTitle: string = EllipseSelectionToolConstants.TOOL_TITLE;
    infoBubble: string = EllipseSelectionToolConstants.INFO_BUBBLE;
    iconName: string = EllipseSelectionToolConstants.ICON_NAME;
}
