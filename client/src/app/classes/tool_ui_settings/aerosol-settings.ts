import { ToolSettings } from './tool-settings';
import { AerosolToolConstants } from './tools.constants';

export class AerosolSettings implements ToolSettings {
    readonly TOOL_ID: string = AerosolToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = AerosolToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = AerosolToolConstants.INFO_BUBLE;
    readonly ICON_NAME: string = AerosolToolConstants.ICON_NAME;
}
