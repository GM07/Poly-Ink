import { ToolSettings } from './tool-settings';
import { EraserToolConstants } from './tools.constants';

export class EraserSettings implements ToolSettings {
    readonly TOOL_ID: string = EraserToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = EraserToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = EraserToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = EraserToolConstants.ICON_NAME;
}
