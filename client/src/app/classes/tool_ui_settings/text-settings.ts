import { ToolSettings } from './tool-settings';
import { TextToolConstants } from './tools.constants';

export class TextSettings implements ToolSettings {
    readonly TOOL_ID: string = TextToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = TextToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = TextToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = TextToolConstants.ICON_NAME;
}
