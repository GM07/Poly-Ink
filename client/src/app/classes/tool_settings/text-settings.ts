import { ToolSettings } from './tool-settings';
import { TextToolConstants } from './tools.constants';

export class TextSettings implements ToolSettings {
    toolTitle: string = TextToolConstants.TOOL_TITLE;
    infoBubble: string = TextToolConstants.INFO_BUBBLE;
    iconName: string = TextToolConstants.ICON_NAME;
}
