import { ToolSettings } from './tool-settings';
import { LineToolConstants } from './tools.constants';

export class LineSettings implements ToolSettings {
    readonly toolId: string = LineToolConstants.TOOL_ID;
    readonly toolTitle: string = LineToolConstants.TOOL_TITLE;
    readonly infoBubble: string = LineToolConstants.INFO_BUBBLE;
    readonly iconName: string = LineToolConstants.ICON_NAME;
}
