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
    hexColor: string;

    readonly CANVAS_SIZE: number = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH ** 2;
    @ViewChild('previewPipette', { static: false }) private previewEyeDropper: ElementRef<HTMLCanvasElement>;

    constructor(private eyeDropperService: EyeDropperService) {
        super();
        this.hexColor = '';
    }

    ngAfterViewInit(): void {
        this.eyeDropperService.updatePrevisualisation.subscribe((color: string) => {
            this.hexColor = color;
            if (this.hexColor.length > 0 && this.previewEyeDropper !== undefined) {
                const ctx = this.previewEyeDropper.nativeElement.getContext('2d') as CanvasRenderingContext2D;
                this.drawCircleAroundPreview(ctx, this.previewEyeDropper.nativeElement.width / 2);
                ctx.stroke();
                ctx.drawImage(this.eyeDropperService.previsualisationCanvas, 0, 0);
            }
        });
    }

    private drawCircleAroundPreview(ctx: CanvasRenderingContext2D, size: number): void {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.ellipse(size, size, size - 1, size - 1, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
