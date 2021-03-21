import { ToolSettings } from './tool-settings';
import { StampToolConstants } from './tools.constants';

export class StampSettings implements ToolSettings {
    readonly toolId: string = StampToolConstants.TOOL_ID;
    readonly toolTitle: string = StampToolConstants.TOOL_TITLE;
    readonly infoBubble: string = StampToolConstants.INFO_BUBBLE;
    readonly iconName: string = StampToolConstants.ICON_NAME;
}
