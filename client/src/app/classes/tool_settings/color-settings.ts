import { ToolSettings } from './tool-settings';
import { ColorToolConstants } from './tools.constants';

export class ColorSettings implements ToolSettings {
    toolId: string = ColorToolConstants.TOOL_ID;
    toolTitle: string = ColorToolConstants.TOOL_TITLE;
    infoBubble: string = ColorToolConstants.INFO_BUBBLE;
    iconName: string = ColorToolConstants.ICON_NAME;
}
