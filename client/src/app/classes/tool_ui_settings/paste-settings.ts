import { ToolSettings } from './tool-settings';
import { PasteConstants } from './tools.constants';

export class Paste implements ToolSettings {
    readonly TOOL_ID: string = PasteConstants.TOOL_ID;
    readonly TOOL_TITLE: string = PasteConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = PasteConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = PasteConstants.ICON_NAME;
}
