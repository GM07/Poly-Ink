import { ToolSettings } from './tool-settings';
import { EraserToolConstants } from './tools.constants';

export class EraserSettings implements ToolSettings {
    toolId: string = EraserToolConstants.TOOL_ID;
    toolTitle: string = EraserToolConstants.TOOL_TITLE;
    infoBubble: string = EraserToolConstants.INFO_BUBBLE;
    iconName: string = EraserToolConstants.ICON_NAME;
}
