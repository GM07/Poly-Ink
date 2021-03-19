import { ToolSettings } from './tool-settings';
import { EllipseToolConstants } from './tools.constants';

export class EllipseSettings implements ToolSettings {
    readonly toolId: string = EllipseToolConstants.TOOL_ID;
    readonly toolTitle: string = EllipseToolConstants.TOOL_TITLE;
    readonly infoBubble: string = EllipseToolConstants.INFO_BUBBLE;
    readonly iconName: string = EllipseToolConstants.ICON_NAME;
}
