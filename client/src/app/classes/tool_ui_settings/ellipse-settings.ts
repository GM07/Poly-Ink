import { ToolSettings } from './tool-settings';
import { EllipseToolConstants } from './tools.constants';

export class EllipseSettings implements ToolSettings {
    readonly TOOL_ID: string = EllipseToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = EllipseToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = EllipseToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = EllipseToolConstants.ICON_NAME;
}
