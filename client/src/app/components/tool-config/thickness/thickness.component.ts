import { Component, HostListener } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';

export interface IThicknessComponent {
  thicknessValue: number;
}

export abstract class AbstractThicknessComponent {
  lineWidthIn: number = 5;
}

@Component({
    selector: 'app-thickness',
    templateUrl: './thickness.component.html',
    styleUrls: ['./thickness.component.scss'],
})
export class ThicknessComponent {
    public lineWidthIn: number = 1;

    private wasInside = false;

    @HostListener('document:click')
    clickout() {
        if(!this.wasInside) {
            this.changeThickness();
        }
    }

    constructor(public service: ToolHandlerService) {
    }

    changeThickness() {
      if (this.service.getTool() instanceof PencilService) 
        (<PencilService>this.service.getTool()).lineWidth = this.lineWidthIn;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
