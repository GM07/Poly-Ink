import { ToolSettings } from './tool-settings';
import { PencilToolConstants } from './tools.constants';

export class PencilSettings implements ToolSettings {
    readonly TOOL_ID: string = PencilToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = PencilToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = PencilToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = PencilToolConstants.ICON_NAME;
}
