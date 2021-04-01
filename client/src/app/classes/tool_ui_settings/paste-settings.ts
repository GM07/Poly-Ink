import { ToolSettings } from './tool-settings';
import { PasteConstants } from './tools.constants';

export class Paste implements ToolSettings {
    readonly toolId: string = PasteConstants.TOOL_ID;
    readonly toolTitle: string = PasteConstants.TOOL_TITLE;
    readonly infoBubble: string = PasteConstants.INFO_BUBBLE;
    readonly iconName: string = PasteConstants.ICON_NAME;
}
