import { Injectable } from '@angular/core';
import { CanvasConst } from '@app/constants/canvas';
import { BehaviorSubject } from 'rxjs';
import { DrawingService } from './drawing.service';

@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    private barPercentage: number = 5;
    private fullPercentage: number = 100;
    showWarning: boolean;

    changes: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private drawingService: DrawingService) {}

    newCanvas(
        confirm: boolean = false,
        width: number = (document.documentElement.clientWidth - document.documentElement.clientWidth / (this.fullPercentage / this.barPercentage)) /
            2,
        height: number = document.documentElement.clientHeight / 2,
    ): void {
        if (!confirm && this.isNotEmpty(this.drawingService.baseCtx, this.drawingService.canvas.width, this.drawingService.canvas.height)) {
            this.showWarning = true;
            return;
        }

        width = Math.max(width, CanvasConst.MIN_WIDTH);
        height = Math.max(height, CanvasConst.MIN_HEIGHT);

        this.drawingService.resizeCanvas(width, height);
        this.drawingService.initBackground();

        this.changes.next(0);
    }

    isNotEmpty(baseCtx: CanvasRenderingContext2D, width: number, height: number): boolean {
        const whiteColor = 4294967295;
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, width, height).data.buffer);
        if (pixelBuffer.some((color) => color !== whiteColor) && pixelBuffer.some((color) => color !== 0)) return true;
        return false;
    }
}
