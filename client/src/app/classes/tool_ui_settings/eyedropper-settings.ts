import { ToolSettings } from './tool-settings';
import { EyeDropperToolConstants } from './tools.constants';

export class EyeDropperSettings implements ToolSettings {
    readonly toolId: string = EyeDropperToolConstants.TOOL_ID;
    readonly toolTitle: string = EyeDropperToolConstants.TOOL_TITLE;
    readonly infoBubble: string = EyeDropperToolConstants.INFO_BUBBLE;
    readonly iconName: string = EyeDropperToolConstants.ICON_NAME;
}
