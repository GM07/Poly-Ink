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
        const memoryCanvas = document.createElement('canvas'); // canvas temporaire
        this.saveCanvas(memoryCanvas);
        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width; // Redimensionnement du canvas
        this.previewCanvas.height = height;
        this.baseCtx.drawImage(memoryCanvas, 0, 0);

        if (memoryCanvas.width < this.canvas.width || memoryCanvas.height < this.canvas.height) {
            this.drawWhite(memoryCanvas);
        }
    }

    saveCanvas(memoryCanvas: HTMLCanvasElement): void {
        const memoryCtx = memoryCanvas.getContext('2d');
        memoryCanvas.width = this.canvas.width;
        memoryCanvas.height = this.canvas.height; // Sauvegarde du canvas
        if (memoryCtx != null) {
            memoryCtx.drawImage(this.canvas, 0, 0); // Ne devrait jamais être égal à nul.
        } else {
            alert('Erreur when resizing');
        }
    }

    drawWhite(memoryCanvas: HTMLCanvasElement): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(memoryCanvas.width, 0, this.canvas.width - memoryCanvas.width, this.canvas.height);
        this.baseCtx.fillRect(0, memoryCanvas.height, this.canvas.width, this.canvas.height - memoryCanvas.height);
    }

    initBackground(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
