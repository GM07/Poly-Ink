import { ToolSettings } from './tool-settings';
import { EraserToolConstants } from './tools.constants';

export class EraserSettings implements ToolSettings {
    readonly toolId: string = EraserToolConstants.TOOL_ID;
    readonly toolTitle: string = EraserToolConstants.TOOL_TITLE;
    readonly infoBubble: string = EraserToolConstants.INFO_BUBBLE;
    readonly iconName: string = EraserToolConstants.ICON_NAME;
}
