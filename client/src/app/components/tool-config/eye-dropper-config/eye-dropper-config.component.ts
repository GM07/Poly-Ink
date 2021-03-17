import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';

@Component({
    selector: 'app-eye-dropper-config',
    templateUrl: './eye-dropper-config.component.html',
    styleUrls: ['./eye-dropper-config.component.scss'],
})
export class EyeDropperConfigComponent extends ToolConfig implements AfterViewInit {
    @ViewChild('previewPipette', { static: false }) previewEyeDropper: ElementRef<HTMLCanvasElement>;
    hexColor: string;

    readonly CANVAS_SIZE: number = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH ** 2;

    constructor(public eyeDropperService: EyeDropperService) {
        super();
        this.hexColor = '';
    }

    ngAfterViewInit(): void {
        this.eyeDropperService.updatePrevisualisation.subscribe((color: string) => {
            this.hexColor = color;
            if (this.hexColor.length > 0 && this.previewEyeDropper !== undefined) {
                const ctx = this.previewEyeDropper.nativeElement.getContext('2d') as CanvasRenderingContext2D;
                ctx.drawImage(this.eyeDropperService.previsualisationCanvas, 0, 0);
            }
        });
    }
}
