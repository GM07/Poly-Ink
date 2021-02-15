import { ToolSettings } from './tool-settings';
import { StampToolConstants } from './tools.constants';

export class StampSettings implements ToolSettings {
    toolId: string = StampToolConstants.TOOL_ID;
    toolTitle: string = StampToolConstants.TOOL_TITLE;
    infoBubble: string = StampToolConstants.INFO_BUBBLE;
    iconName: string = StampToolConstants.ICON_NAME;
}
