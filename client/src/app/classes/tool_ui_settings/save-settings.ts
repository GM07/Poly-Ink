import { ToolSettings } from './tool-settings';
import { SaveFileToolConsants } from './tools.constants';

export class SaveSettings implements ToolSettings {
    readonly toolId: string = SaveFileToolConsants.TOOL_ID;
    readonly toolTitle: string = SaveFileToolConsants.TOOL_TITLE;
    readonly infoBubble: string = SaveFileToolConsants.INFO_BUBBLE;
    readonly iconName: string = SaveFileToolConsants.ICON_NAME;
}
