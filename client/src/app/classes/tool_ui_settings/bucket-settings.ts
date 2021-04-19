import { ToolSettings } from './tool-settings';
import { BucketToolConstants } from './tools.constants';

export class BucketSettings implements ToolSettings {
    readonly TOOL_ID: string = BucketToolConstants.TOOL_ID;
    readonly TOOL_TITLE: string = BucketToolConstants.TOOL_TITLE;
    readonly INFO_BUBBLE: string = BucketToolConstants.INFO_BUBBLE;
    readonly ICON_NAME: string = BucketToolConstants.ICON_NAME;
}
