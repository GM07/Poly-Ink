import { ToolSettings } from './tool-settings';
import { PolygoneToolConstants } from './tools.constants';

export class PolygoneSettings implements ToolSettings {
    readonly toolId: string = PolygoneToolConstants.TOOL_ID;
    readonly toolTitle: string = PolygoneToolConstants.TOOL_TITLE;
    readonly infoBubble: string = PolygoneToolConstants.INFO_BUBBLE;
    readonly iconName: string = PolygoneToolConstants.ICON_NAME;
}
