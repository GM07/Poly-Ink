import { ToolSettings } from './tool-settings';
import { LassoToolConstants } from './tools.constants';

export class LassoSettings implements ToolSettings {
    toolId: string = LassoToolConstants.TOOL_ID;
    toolTitle: string = LassoToolConstants.TOOL_TITLE;
    infoBubble: string = LassoToolConstants.INFO_BUBBLE;
    iconName: string = LassoToolConstants.ICON_NAME;
}
