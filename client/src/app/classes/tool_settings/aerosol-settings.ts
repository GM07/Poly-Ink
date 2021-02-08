import { ToolSettings } from './tool-settings';
import { AerosolToolConstants } from './tools.constants';

export class AerosolSettings implements ToolSettings {
    toolId: string = AerosolToolConstants.TOOL_ID;
    toolTitle: string = AerosolToolConstants.TOOL_TITLE;
    infoBubble: string = AerosolToolConstants.INFO_BUBLE;
    iconName: string = AerosolToolConstants.ICON_NAME;
}
