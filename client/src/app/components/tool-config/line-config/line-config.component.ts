import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { LineService } from '@app/services/tools/line-service';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent extends ToolConfig {

    public withJunctionPoint: boolean;

    constructor(public lineService: LineService) {
        super();
        this.withJunctionPoint = true;
    }
    
    colorSliderLabel(value: number): string {
        return value + 'px';
    }
    
    toggleLineType(lineType: string): void {
        lineType === 'point' ? (this.withJunctionPoint = true) : (this.withJunctionPoint = false);
        this.lineService.showJunctionPoints = this.withJunctionPoint;
    }
    
}