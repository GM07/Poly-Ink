import { ToolSettings } from './tool-settings';
import { BucketToolConstants } from './tools.constants';

export class BucketSettings implements ToolSettings {
    readonly toolId: string = BucketToolConstants.TOOL_ID;
    readonly toolTitle: string = BucketToolConstants.TOOL_TITLE;
    readonly infoBubble: string = BucketToolConstants.INFO_BUBBLE;
    readonly iconName: string = BucketToolConstants.ICON_NAME;
}
