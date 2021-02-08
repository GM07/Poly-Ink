import { ToolSettings } from './tool-settings';
import { ExportFileToolConstants } from './tools.constants';

export class ExportSettings implements ToolSettings {
    toolId: string = ExportFileToolConstants.TOOL_ID;
    toolTitle: string = ExportFileToolConstants.TOOL_TITLE;
    infoBubble: string = ExportFileToolConstants.INFO_BUBBLE;
    iconName: string = ExportFileToolConstants.ICON_NAME;
}
