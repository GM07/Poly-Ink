import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { MagnetismService } from './magnetism.service';

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

    constructor(private undoRedoService: UndoRedoService, public magnetismService: MagnetismService) {
        this.changes = new Subject();
    }

    static saveCanvas(memoryCanvas: HTMLCanvasElement, canvas: HTMLCanvasElement): void {
        const memoryCtx = memoryCanvas.getContext('2d') as CanvasRenderingContext2D;
        memoryCanvas.width = canvas.width;
        memoryCanvas.height = canvas.height; // Saving canvas
        memoryCtx.drawImage(canvas, 0, 0);
    }

    initLoadedCanvas(): void {
        if (this.isReloading()) {
            this.createLoadedCanvasFromStorage();
        } else {
            this.loadedCanvas = undefined;
        }
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas(width: number, height: number): void {
        const memoryBaseCanvas = document.createElement('canvas'); // Temporary canvas
        const memoryPreviewCanvas = document.createElement('canvas'); // Temporary canvas
        DrawingService.saveCanvas(memoryBaseCanvas, this.canvas);
        DrawingService.saveCanvas(memoryPreviewCanvas, this.previewCanvas);

        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width;
        this.previewCanvas.height = height;
        this.magnetismService.gridService.canvas.width = width;
        this.magnetismService.gridService.canvas.height = height;

        this.initBackground();

        this.baseCtx.drawImage(memoryBaseCanvas, 0, 0);
        this.previewCtx.drawImage(memoryPreviewCanvas, 0, 0);
        if (!this.isReloading()) {
            this.save(this.baseCtx);
        }
        this.changes.next();

        this.magnetismService.gridService.updateGrid();
    }

    initUndoRedo(): void {
        const config = new ResizeConfig();
        config.height = this.canvas.height;
        config.width = this.canvas.width;
        const initialResize = new ResizeDraw(config, this);
        this.undoRedoService.init(this.baseCtx, this.previewCtx, initialResize);
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
        if (!this.isReloading()) {
            this.save(this.baseCtx);
        }
    }

    async loadDrawing(): Promise<void> {
        if (this.isReloading()) {
            await this.createLoadedCanvasFromStorage();
        }
        if (this.loadedCanvas === undefined) return;
        const width = this.loadedCanvas.width;
        const height = this.loadedCanvas.height;
        this.resizeCanvas(width, height);
        this.baseCtx.drawImage(this.loadedCanvas, 0, 0);
        this.initUndoRedo();
        this.loadedCanvas = undefined;
        this.save(this.baseCtx);
        this.setIsDoneReloading();
    }

    getSavedDrawing(): string | null {
        return localStorage.getItem('drawing');
    }

    removeSavedDrawing(): void {
        localStorage.removeItem('drawing');
    }

    setIsDoneReloading(): void {
        localStorage.removeItem('editor_reloading');
    }

    async createLoadedCanvasFromStorage(): Promise<void> {
        const canvas = document.createElement('canvas');
        const canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D;
        const savedImage: HTMLImageElement = new Image();
        const savedDrawingStr: string | null = this.getSavedDrawing();
        if (savedDrawingStr !== null) {
            savedImage.src = savedDrawingStr;
            await this.loadImagePromise(savedImage);
            canvas.width = savedImage.width;
            canvas.height = savedImage.height;
            canvasCTX.drawImage(savedImage, 0, 0);
            this.loadedCanvas = canvas;
        }
    }

    draw(command: AbstractDraw): void {
        this.unblockUndoRedo();
        command.execute(this.baseCtx);
        this.save(this.baseCtx);
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

    async loadImagePromise(image: HTMLImageElement): Promise<Event> {
        return new Promise((resolve) => {
            image.onload = resolve;
        });
    }

    private isReloading(): boolean {
        return localStorage.getItem('editor_reloading') !== null;
    }

    private save(canvas: CanvasRenderingContext2D): void {
        localStorage.setItem('drawing', canvas.canvas.toDataURL());
    }
}
