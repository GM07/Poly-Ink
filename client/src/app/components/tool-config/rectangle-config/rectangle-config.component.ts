import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { RectangleService } from '@app/services/tools/rectangle-service';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {
    traceTypeTestIn: number;

    constructor(public rectangleService: RectangleService) {
        super();
        this.traceTypeTestIn = 0;
    }

    traceTypeTest(rectangleMode: number): void {
        this.traceTypeTestIn = rectangleMode;
        this.rectangleService.rectangleMode = this.traceTypeTestIn;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
