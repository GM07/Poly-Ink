import { ToolSettings } from './tool-settings';
import { EyeDropperToolConstants } from './tools.constants';

export class EyeDropperSettings implements ToolSettings {
    toolId: string = EyeDropperToolConstants.TOOL_ID;
    toolTitle: string = EyeDropperToolConstants.TOOL_TITLE;
    infoBubble: string = EyeDropperToolConstants.INFO_BUBBLE;
    iconName: string = EyeDropperToolConstants.ICON_NAME;
}
