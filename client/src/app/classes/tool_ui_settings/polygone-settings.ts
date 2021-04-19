import { ToolSettings } from './tool-settings';
import { PolygoneToolConstants } from './tools.constants';

export class PolygoneSettings implements ToolSettings {
    readonly TOOL_ID: string = PolygoneToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = PolygoneToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = PolygoneToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = PolygoneToolConstants.ICON_NAME;
}
