import { ToolSettings } from './tool-settings';
import { TextToolConstants } from './tools.constants';

export class TextSettings implements ToolSettings {
    toolId: string = TextToolConstants.TOOL_ID;
    toolTitle: string = TextToolConstants.TOOL_TITLE;
    infoBubble: string = TextToolConstants.INFO_BUBBLE;
    iconName: string = TextToolConstants.ICON_NAME;
}
