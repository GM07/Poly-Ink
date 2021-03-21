import { ToolSettings } from './tool-settings';
import { FillToolConstants } from './tools.constants';

export class FillSettings implements ToolSettings {
    readonly toolId: string = FillToolConstants.TOOL_ID;
    readonly toolTitle: string = FillToolConstants.TOOL_TITLE;
    readonly infoBubble: string = FillToolConstants.INFO_BUBBLE;
    readonly iconName: string = FillToolConstants.ICON_NAME;
}
