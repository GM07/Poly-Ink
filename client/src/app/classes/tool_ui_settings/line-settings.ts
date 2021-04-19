import { ToolSettings } from './tool-settings';
import { LineToolConstants } from './tools.constants';

export class LineSettings implements ToolSettings {
    readonly TOOL_ID: string = LineToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = LineToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = LineToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = LineToolConstants.ICON_NAME;
}
