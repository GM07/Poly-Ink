import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas(width: number, height: number): void {
        const memCanvas = document.createElement('canvas'); // canvas temporaire
        const memCtx = memCanvas.getContext('2d');

        memCanvas.width = this.canvas.width;
        memCanvas.height = this.canvas.height; // Sauvegarde du canvas
        memCtx?.drawImage(this.canvas, 0, 0); // Ne devrait jamais être égal à nul.

        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width; // Redimensionnement du canvas
        this.previewCanvas.height = height;
        this.baseCtx.drawImage(memCanvas, 0, 0);

        if (memCanvas.width < this.canvas.width || memCanvas.height < this.canvas.height) {
            this.baseCtx.fillStyle = 'white';
            this.baseCtx.fillRect(memCanvas.width, 0, this.canvas.width - memCanvas.width, this.canvas.height);
            this.baseCtx.fillRect(0, memCanvas.height, this.canvas.width, this.canvas.height - memCanvas.height);
        }
    }

    initBackground(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
