import { ToolSettings } from './tool-settings';
import { SaveFileToolConstants } from './tools.constants';

export class SaveSettings implements ToolSettings {
    readonly TOOL_ID: string = SaveFileToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = SaveFileToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = SaveFileToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = SaveFileToolConstants.ICON_NAME;
}
