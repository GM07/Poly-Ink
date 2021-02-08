import { ToolSettings } from './tool-settings';
import { NewDrawingConstants } from './tools.constants';

export class NewDrawing implements ToolSettings {
    toolId : string = NewDrawingConstants.TOOL_ID;
    toolTitle: string = NewDrawingConstants.TOOL_TITLE;
    infoBubble: string = NewDrawingConstants.INFO_BUBBLE;
    iconName: string = NewDrawingConstants.ICON_NAME;
}
