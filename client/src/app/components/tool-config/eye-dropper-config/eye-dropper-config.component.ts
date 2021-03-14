import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';

@Component({
    selector: 'app-pipette-config',
    templateUrl: './pipette-config.component.html',
    styleUrls: ['./pipette-config.component.scss'],
})
export class EyeDropperConfigComponent extends ToolConfig implements AfterViewInit {
    @ViewChild('previewPipette', { static: false }) previewPipette: ElementRef<HTMLCanvasElement>;

    constructor(public pipetteService: EyeDropperService) {
        super();
    }

    ngAfterViewInit(): void {
        this.pipetteService.previsualisationCanvas = this.previewPipette.nativeElement;
        this.pipetteService.previsualisationCtx = this.previewPipette.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
}
