import { Component } from '@angular/core';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
