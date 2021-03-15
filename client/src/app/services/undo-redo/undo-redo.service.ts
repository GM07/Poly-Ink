import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    context: CanvasRenderingContext2D;
    preview: CanvasRenderingContext2D;
    shortcutUndo: ShortcutKey;
    shortcutRedo: ShortcutKey;
    originalResize: ResizeDraw;
    originalImage: ImageData;

    commands: AbstractDraw[] = [];
    currentAction: number = -1;

    constructor() {
        this.shortcutRedo = new ShortcutKey('z', true, true, false);
        this.shortcutUndo = new ShortcutKey('z', true);
    }

    init(context: CanvasRenderingContext2D, preview: CanvasRenderingContext2D, originalResize: ResizeDraw): void {
        this.originalResize = originalResize;
        this.preview = preview;
        this.context = context;
        this.originalImage = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    saveCommand(command: AbstractDraw): void {
        if (this.currentAction >= 0) this.commands.splice(this.currentAction + 1);

        this.commands.push(command);
        this.currentAction += 1;
    }

    undo(): void {
        if (this.currentAction < 0) return;

        this.currentAction -= 1;

       this.originalResize.execute(this.context);
       this.context.putImageData(this.originalImage, 0, 0);

        for (let i = 0; i <= this.currentAction; i++) {
            this.commands[i].execute(this.context);
        }
    }

    redo(): void {
        if (this.currentAction >= this.commands.length - 1) return;

        this.currentAction += 1;

        this.commands[this.currentAction].execute(this.context);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.shortcutRedo.equals(event)) this.redo();
        else if (this.shortcutUndo.equals(event)) this.undo();
    }
}
