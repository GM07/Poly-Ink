import { ToolSettings } from './tool-settings';
import { LineToolConstants } from './tools.constants';

export class LineSettings implements ToolSettings {
    toolId: string = LineToolConstants.TOOL_ID;
    toolTitle: string = LineToolConstants.TOOL_TITLE;
    infoBubble: string = LineToolConstants.INFO_BUBBLE;
    iconName: string = LineToolConstants.ICON_NAME;
}
