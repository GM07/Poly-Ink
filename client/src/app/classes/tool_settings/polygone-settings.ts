import { ToolSettings } from './tool-settings';
import { PolygoneToolConstants } from './tools.constants';

export class PolygoneSettings implements ToolSettings {
    toolTitle: string = PolygoneToolConstants.TOOL_TITLE;
    infoBubble: string = PolygoneToolConstants.INFO_BUBBLE;
    iconName: string = PolygoneToolConstants.ICON_NAME;
}
