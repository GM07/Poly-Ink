import { ToolSettings } from './tool-settings';
import { ColorToolConstants } from './tools.constants';

export class ColorSettings implements ToolSettings {
    toolTitle: string = ColorToolConstants.TOOL_TITLE;
    infoBubble: string = ColorToolConstants.INFO_BUBBLE;
    iconName: string = ColorToolConstants.ICON_NAME;
}
