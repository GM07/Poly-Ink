import { ToolSettings } from './tool-settings';
import { StampToolConstants } from './tools.constants';

export class StampSettings implements ToolSettings {
    readonly TOOL_ID: string = StampToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = StampToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = StampToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = StampToolConstants.ICON_NAME;
}
