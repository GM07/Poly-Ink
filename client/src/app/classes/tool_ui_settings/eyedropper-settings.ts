import { ToolSettings } from './tool-settings';
import { EyeDropperToolConstants } from './tools.constants';

export class EyeDropperSettings implements ToolSettings {
    readonly TOOL_ID: string = EyeDropperToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = EyeDropperToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = EyeDropperToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = EyeDropperToolConstants.ICON_NAME;
}
