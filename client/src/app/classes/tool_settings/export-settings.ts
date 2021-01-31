import { ToolSettings } from './tool-settings';
import { ExportFileToolConstants } from './tools.constants';

export class ExportSettings implements ToolSettings {
    toolTitle: string = ExportFileToolConstants.TOOL_TITLE;
    infoBubble: string = ExportFileToolConstants.INFO_BUBBLE;
    iconName: string = ExportFileToolConstants.ICON_NAME;
}
