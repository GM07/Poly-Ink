import { ToolSettings } from './tool-settings';
import { NewDrawingConstants } from './tools.constants';

export class NewDrawing implements ToolSettings {
    readonly TOOL_ID: string = NewDrawingConstants.TOOL_ID;
    readonly TOOL_TITLE: string = NewDrawingConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = NewDrawingConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = NewDrawingConstants.ICON_NAME;
}
