import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    loadedCanvas: HTMLCanvasElement | undefined;

    constructor() {
        this.loadedCanvas = undefined;
    }

    changes: Subject<string> = new Subject<string>();

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas(width: number, height: number): void {
        const memoryCanvas = document.createElement('canvas'); // Temporary canvas
        this.saveCanvas(memoryCanvas);
        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width; // Canvas resize
        this.previewCanvas.height = height;
        this.baseCtx.drawImage(memoryCanvas, 0, 0);

        if (memoryCanvas.width < this.canvas.width || memoryCanvas.height < this.canvas.height) {
            this.drawWhite(memoryCanvas);
        }
        this.changes.next();
    }

    private saveCanvas(memoryCanvas: HTMLCanvasElement): void {
        const memoryCtx = memoryCanvas.getContext('2d');
        memoryCanvas.width = this.canvas.width;
        memoryCanvas.height = this.canvas.height; // Saving canvas
        if (memoryCtx != null) {
            memoryCtx.drawImage(this.canvas, 0, 0); // Should never be null
        } else {
            alert('Error when resizing');
        }
    }

    private drawWhite(memoryCanvas: HTMLCanvasElement): void {
        const color = this.baseCtx.fillStyle;
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(memoryCanvas.width, 0, this.canvas.width - memoryCanvas.width, this.canvas.height);
        this.baseCtx.fillRect(0, memoryCanvas.height, this.canvas.width, this.canvas.height - memoryCanvas.height);
        this.baseCtx.fillStyle = color;
    }

    initBackground(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loadDrawing(): void {
        if (this.loadedCanvas === undefined) return;
        const width = this.loadedCanvas.width;
        const height = this.loadedCanvas.height;
        this.resizeCanvas(width, height);
        this.baseCtx.drawImage(this.loadedCanvas, 0, 0);

        this.loadedCanvas = undefined;
    }
}
