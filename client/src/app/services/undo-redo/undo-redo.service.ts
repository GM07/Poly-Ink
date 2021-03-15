import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from './../../classes/commands/resize-draw';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    context: CanvasRenderingContext2D;
    preview: CanvasRenderingContext2D;
    originalResize: ResizeDraw;
    originalImage: ImageData;

    commands: AbstractDraw[] = [];
    currentAction: number = -1;

    init(context: CanvasRenderingContext2D, preview: CanvasRenderingContext2D, originalResize: ResizeDraw) {
        this.originalResize = originalResize;
        this.preview = preview;
        this.context = context;
        this.originalImage = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    saveCommand(command: AbstractDraw) {
        if (this.currentAction >= 0) this.commands.splice(this.currentAction + 1);

        this.commands.push(command);
        this.currentAction += 1;
    }

    undo() {
        if (!this.isPreviewEmpty) return;
        if (this.currentAction < 0) return;

        this.currentAction -= 1;

        this.originalResize.execute(this.context);
        this.context.putImageData(this.originalImage, 0, 0);

        for (let i = 0; i <= this.currentAction; i++) {
            this.commands[i].execute(this.context);
        }
    }

    redo() {
        if (!this.isPreviewEmpty) return;
        if (this.currentAction >= this.commands.length - 1) return;

        this.currentAction += 1;

        this.commands[this.currentAction].execute(this.context);
    }

    isPreviewEmpty(): boolean {
        const whiteColor = 4294967295; // White color constant
        const pixelBuffer = new Uint32Array(this.preview.getImageData(0, 0, this.preview.canvas.width, this.preview.canvas.height).data.buffer);
        return pixelBuffer.some((color) => color !== whiteColor) && pixelBuffer.some((color) => color !== 0);
    }
}
