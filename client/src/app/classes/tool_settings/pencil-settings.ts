import { ToolSettings } from './tool-settings';
import { PencilToolConstants } from './tools.constants';

export class Pencilsettings implements ToolSettings {
    toolTitle: string = PencilToolConstants.TOOL_TITLE;
    infoBubble: string = PencilToolConstants.INFO_BUBBLE;
    iconName: string = PencilToolConstants.ICON_NAME;
    set size(s: number){
        if(s <100 )
            this.sizeIN = s;
    }

    sizeIN: number = 2;
}

