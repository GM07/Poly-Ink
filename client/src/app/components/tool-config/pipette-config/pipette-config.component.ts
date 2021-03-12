import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { PipetteService } from '@app/services/tools/pipette.service';

@Component({
    selector: 'app-pipette-config',
    templateUrl: './pipette-config.component.html',
    styleUrls: ['./pipette-config.component.scss'],
})
export class PipetteConfigComponent extends ToolConfig implements AfterViewInit {

  @ViewChild('previewPipette', { static: false }) previewPipette: ElementRef<HTMLCanvasElement>;

    constructor(public pipetteService: PipetteService) {
        super();
    }

    ngAfterViewInit(){
      this.pipetteService.previsualisationCanvas = this.previewPipette.nativeElement;
      this.pipetteService.previsualisationCtx = this.previewPipette.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    sliderLabel(value: number): string {
        return value + 'px';
    }
}
