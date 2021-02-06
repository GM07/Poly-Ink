import { Component } from '@angular/core';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent extends ToolConfig {
    
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
