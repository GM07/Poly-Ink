import { ToolSettings } from './tool-settings';
import { FillToolConstants } from './tools.constants';

export class FillSettings implements ToolSettings {
    toolTitle: string = FillToolConstants.TOOL_TITLE;
    infoBubble: string = FillToolConstants.INFO_BUBBLE;
    iconName: string = FillToolConstants.ICON_NAME;
}
