import { Component } from '@angular/core';
import { LineService } from '@app/services/tools/line-service';
import { ToolConfig } from '../tool-config';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent extends ToolConfig {

    withJunctionPoint: boolean;

    constructor(public lineService: LineService) {
        super();
    }
    
    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    toggleTypeLigne(typeLigne: string): void {
        typeLigne === 'normal' ? (this.withJunctionPoint = false) : (this.withJunctionPoint = true);
    }
}
