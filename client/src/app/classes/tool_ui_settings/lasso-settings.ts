import { ToolSettings } from './tool-settings';
import { LassoToolConstants } from './tools.constants';

export class LassoSettings implements ToolSettings {
    readonly toolId: string = LassoToolConstants.TOOL_ID;
    readonly toolTitle: string = LassoToolConstants.TOOL_TITLE;
    readonly infoBubble: string = LassoToolConstants.INFO_BUBBLE;
    readonly iconName: string = LassoToolConstants.ICON_NAME;
}
