import { ToolSettings } from './tool-settings';
import { ExportFileToolConstants } from './tools.constants';

export class ExportSettings implements ToolSettings {
    readonly toolId: string = ExportFileToolConstants.TOOL_ID;
    readonly toolTitle: string = ExportFileToolConstants.TOOL_TITLE;
    readonly infoBubble: string = ExportFileToolConstants.INFO_BUBBLE;
    readonly iconName: string = ExportFileToolConstants.ICON_NAME;
}
