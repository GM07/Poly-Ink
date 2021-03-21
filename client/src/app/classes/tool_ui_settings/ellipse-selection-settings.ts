import { ToolSettings } from './tool-settings';
import { EllipseSelectionToolConstants } from './tools.constants';

export class EllipseSelectionSettings implements ToolSettings {
    readonly toolId: string = EllipseSelectionToolConstants.TOOL_ID;
    readonly toolTitle: string = EllipseSelectionToolConstants.TOOL_TITLE;
    readonly infoBubble: string = EllipseSelectionToolConstants.INFO_BUBBLE;
    readonly iconName: string = EllipseSelectionToolConstants.ICON_NAME;
}
