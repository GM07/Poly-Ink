import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;

    changes: Subject<void> = new Subject<void>();

    constructor(private undoRedoService: UndoRedoService) {}

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

    initUndoRedo(): void {
        const config = new ResizeConfig();
        config.height = this.canvas.height;
        config.width = this.canvas.width;
        const initialResize = new ResizeDraw(config, this);
        this.undoRedoService.init(this.baseCtx, this.previewCtx, initialResize);
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

    blockUndoRedo(): void {
        this.undoRedoService.blockUndoRedo = true;
    }

    initBackground(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(command: AbstractDraw): void {
        this.undoRedoService.blockUndoRedo = false;
        command.execute(this.baseCtx);
        this.undoRedoService.saveCommand(command);
    }

    drawPreview(command: AbstractDraw): void {
        this.blockUndoRedo();
        this.clearCanvas(this.previewCtx);
        command.execute(this.previewCtx);
    }
}
