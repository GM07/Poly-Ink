import { ToolSettings } from './tool-settings';
import { EllipseToolConstants } from './tools.constants';

export class EllipseSettings implements ToolSettings {
    toolId: string = EllipseToolConstants.TOOL_ID;
    toolTitle: string = EllipseToolConstants.TOOL_TITLE;
    infoBubble: string = EllipseToolConstants.INFO_BUBBLE;
    iconName: string = EllipseToolConstants.ICON_NAME;
}