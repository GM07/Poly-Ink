import { ToolSettings } from './tool-settings';
import { LassoToolConstants } from './tools.constants';

export class LassoSettings implements ToolSettings {
    readonly TOOL_ID: string = LassoToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = LassoToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = LassoToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = LassoToolConstants.ICON_NAME;
}
