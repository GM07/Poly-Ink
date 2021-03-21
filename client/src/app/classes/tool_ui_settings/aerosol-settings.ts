import { ToolSettings } from './tool-settings';
import { AerosolToolConstants } from './tools.constants';

export class AerosolSettings implements ToolSettings {
    readonly toolId: string = AerosolToolConstants.TOOL_ID;
    readonly toolTitle: string = AerosolToolConstants.TOOL_TITLE;
    readonly infoBubble: string = AerosolToolConstants.INFO_BUBLE;
    readonly iconName: string = AerosolToolConstants.ICON_NAME;
}
