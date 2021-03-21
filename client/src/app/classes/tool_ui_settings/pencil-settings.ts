import { ToolSettings } from './tool-settings';
import { PencilToolConstants } from './tools.constants';

export class PencilSettings implements ToolSettings {
    readonly toolId: string = PencilToolConstants.TOOL_ID;
    readonly toolTitle: string = PencilToolConstants.TOOL_TITLE;
    readonly infoBubble: string = PencilToolConstants.INFO_BUBBLE;
    readonly iconName: string = PencilToolConstants.ICON_NAME;
}
