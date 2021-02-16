import { Injectable } from '@angular/core';
import { CanvasConst } from '@app/constants/canvas';
import { BehaviorSubject } from 'rxjs';
import { DrawingService } from './drawing.service';

@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    showWarning: boolean;

    changes: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private drawingService: DrawingService) {}

    newCanvas(confirm: boolean = false): void {
        if (!confirm && this.isNotEmpty(this.drawingService.baseCtx, this.drawingService.canvas.width, this.drawingService.canvas.height)) {
            this.showWarning = true;
            return;
        }

        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        const canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        const canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;

        let width: number = (document.documentElement.clientWidth - canvasLeft) / 2;
        let height: number = (document.documentElement.clientHeight - canvasTop) / 2;

        width = Math.max(width, CanvasConst.MIN_WIDTH);
        height = Math.max(height, CanvasConst.MIN_HEIGHT);

        this.drawingService.resizeCanvas(width, height);
        this.drawingService.initBackground();

        this.changes.next(0);
    }

    isNotEmpty(baseCtx: CanvasRenderingContext2D, width: number, height: number): boolean {
        const whiteColor = 4294967295; // Constante pour la couleur blanche
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, width, height).data.buffer);
        return pixelBuffer.some((color) => color !== whiteColor) && pixelBuffer.some((color) => color !== 0);
    }
}
