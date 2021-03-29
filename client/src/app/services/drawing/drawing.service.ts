import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
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

    constructor(private undoRedoService: UndoRedoService, private autoSaveService: AutoSaveService, private router: Router) {
        this.changes = new Subject();
        if(this.isReloading()) {
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
        if (!this.isReloading) {
            this.autoSaveService.save(this.baseCtx);
        }
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
        if(!this.isReloading) {
            this.autoSaveService.save(this.baseCtx);
        }
    }

    async loadDrawing(): Promise<void> {
        if(this.isReloading()) {
            await this.createLoadedCanvasFromStorage();
        }
        if (this.loadedCanvas === undefined) return;
        console.log('we found something....');
        const width = this.loadedCanvas.width;
        const height = this.loadedCanvas.height;
        this.resizeCanvas(width, height);
        this.baseCtx.drawImage(this.loadedCanvas, 0, 0);
        this.initUndoRedo();
        this.loadedCanvas = undefined;
        this.autoSaveService.save(this.baseCtx);
        this.setIsDoneReloading();
    }

    getSavedDrawing(): string | null {
            return localStorage.getItem('drawing');
    }

    private setIsDoneReloading(): void {
        localStorage.removeItem('editor_reloading');
    }

    private isReloading(): boolean {
        return localStorage.getItem('editor_reloading') !== null;
    }

    async createLoadedCanvasFromStorage (): Promise<void> {
        const canvas = document.createElement('canvas');
        const canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D;
        let savedImage: HTMLImageElement = new Image();
        const savedDrawingStr: string | null = this.getSavedDrawing();
        if(savedDrawingStr !== null) {
            savedImage.src = savedDrawingStr; 
            await this.loadImagePromise(savedImage);
            canvas.width = savedImage.width;
            canvas.height = savedImage.height;
            canvasCTX.drawImage(savedImage, 0, 0);
            this.loadedCanvas = canvas;
            this.router.navigateByUrl('editor');
        }
    }

    private loadImagePromise(image: HTMLImageElement) : Promise<Event> {
        return new Promise((resolve, _) => {
            image.onload = resolve;
        });
    }

    draw(command: AbstractDraw): void {
        this.undoRedoService.blockUndoRedo = false;
        command.execute(this.baseCtx);
        this.autoSaveService.save(this.baseCtx);
        this.undoRedoService.saveCommand(command);
    }

    drawPreview(command: AbstractDraw): void {
        this.blockUndoRedo();
        this.clearCanvas(this.previewCtx);
        command.execute(this.previewCtx);
    }
}
