import { ToolSettings } from './tool-settings';
import { EllipseSelectionToolConstants } from './tools.constants';

export class EllipseSelectionSettings implements ToolSettings {
    readonly TOOL_ID: string = EllipseSelectionToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = EllipseSelectionToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = EllipseSelectionToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = EllipseSelectionToolConstants.ICON_NAME;
}
