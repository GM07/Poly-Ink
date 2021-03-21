import { ToolSettings } from './tool-settings';
import { SaveFileToolConstants } from './tools.constants';

export class SaveSettings implements ToolSettings {
    readonly toolId: string = SaveFileToolConstants.TOOL_ID;
    readonly toolTitle: string = SaveFileToolConstants.TOOL_TITLE;
    readonly infoBubble: string = SaveFileToolConstants.INFO_BUBBLE;
    readonly iconName: string = SaveFileToolConstants.ICON_NAME;
}
