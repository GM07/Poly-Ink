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

    changes: Subject<void>;
    loadedCanvas: HTMLCanvasElement | undefined;

    constructor(private undoRedoService: UndoRedoService) {
        this.changes = new Subject();
        this.loadedCanvas = undefined;
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas(width: number, height: number): void {
        const memoryBaseCanvas = document.createElement('canvas'); // Temporary canvas
        const memoryPreviewCanvas = document.createElement('canvas'); // Temporary canvas
        this.saveCanvas(memoryBaseCanvas, this.canvas);
        this.saveCanvas(memoryPreviewCanvas, this.previewCanvas);

        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width; // Canvas resize
        this.previewCanvas.height = height;

        this.initBackground();

        this.baseCtx.drawImage(memoryBaseCanvas, 0, 0);
        this.previewCtx.drawImage(memoryPreviewCanvas, 0, 0);

        this.changes.next();
    }

    initUndoRedo(): void {
        const config = new ResizeConfig();
        config.height = this.canvas.height;
        config.width = this.canvas.width;
        const initialResize = new ResizeDraw(config, this);
        this.undoRedoService.init(this.baseCtx, this.previewCtx, initialResize);
    }

    private saveCanvas(memoryCanvas: HTMLCanvasElement, canvas: HTMLCanvasElement): void {
        const memoryCtx = memoryCanvas.getContext('2d') as CanvasRenderingContext2D;
        memoryCanvas.width = canvas.width;
        memoryCanvas.height = canvas.height; // Saving canvas
        memoryCtx.drawImage(canvas, 0, 0);
    }

    blockUndoRedo(): void {
        this.undoRedoService.blockUndoRedo = true;
    }

    unblockUndoRedo(): void {
        this.undoRedoService.blockUndoRedo = false;
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
        this.initUndoRedo();
        this.loadedCanvas = undefined;
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

    passDrawPreview(command: AbstractDraw): void {
        this.clearCanvas(this.previewCtx);
        command.execute(this.previewCtx);
    }
}
