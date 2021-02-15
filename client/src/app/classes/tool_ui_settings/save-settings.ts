import { ToolSettings } from './tool-settings';
import { SaveFileToolConsants } from './tools.constants';

export class SaveSettings implements ToolSettings {
    toolId: string = SaveFileToolConsants.TOOL_ID;
    toolTitle: string = SaveFileToolConsants.TOOL_TITLE;
    infoBubble: string = SaveFileToolConsants.INFO_BUBBLE;
    iconName: string = SaveFileToolConsants.ICON_NAME;
}