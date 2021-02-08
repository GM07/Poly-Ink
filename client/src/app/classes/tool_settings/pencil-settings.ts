import { ToolSettings } from './tool-settings';
import { PencilToolConstants } from './tools.constants';

export class PencilSettings implements ToolSettings {
    toolId: string = PencilToolConstants.TOOL_ID;
    toolTitle: string = PencilToolConstants.TOOL_TITLE;
    infoBubble: string = PencilToolConstants.INFO_BUBBLE;
    iconName: string = PencilToolConstants.ICON_NAME;
}
