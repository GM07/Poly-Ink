import { ToolSettings } from './tool-settings';
import { ExportFileToolConstants } from './tools.constants';

export class ExportSettings implements ToolSettings {
    readonly TOOL_ID: string = ExportFileToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = ExportFileToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = ExportFileToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = ExportFileToolConstants.ICON_NAME;
}
