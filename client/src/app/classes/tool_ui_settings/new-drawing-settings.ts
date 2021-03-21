import { ToolSettings } from './tool-settings';
import { NewDrawingConstants } from './tools.constants';

export class NewDrawing implements ToolSettings {
    readonly toolId: string = NewDrawingConstants.TOOL_ID;
    readonly toolTitle: string = NewDrawingConstants.TOOL_TITLE;
    readonly infoBubble: string = NewDrawingConstants.INFO_BUBBLE;
    readonly iconName: string = NewDrawingConstants.ICON_NAME;
}
