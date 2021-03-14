import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';

@Component({
    selector: 'app-pipette-config',
    templateUrl: './pipette-config.component.html',
    styleUrls: ['./pipette-config.component.scss'],
})
export class EyeDropperConfigComponent extends ToolConfig implements AfterViewInit {
    @ViewChild('previewPipette', { static: false }) previewEyeDropper: ElementRef<HTMLCanvasElement>;

    readonly CANVAS_SIZE: number = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH ** 2;

    constructor(public eyeDropperService: EyeDropperService) {
        super();
    }

    ngAfterViewInit(): void {
        this.eyeDropperService.updatePrevisualisation.subscribe(() => {
            const ctx = this.previewEyeDropper.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(this.eyeDropperService.previsualisationCanvas, 0, 0);
        });
    }
}
