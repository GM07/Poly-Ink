import { ToolSettings } from './tool-settings';
import { TextToolConstants } from './tools.constants';

export class TextSettings implements ToolSettings {
    readonly toolId: string = TextToolConstants.TOOL_ID;
    readonly toolTitle: string = TextToolConstants.TOOL_TITLE;
    readonly infoBubble: string = TextToolConstants.INFO_BUBBLE;
    readonly iconName: string = TextToolConstants.ICON_NAME;
}
