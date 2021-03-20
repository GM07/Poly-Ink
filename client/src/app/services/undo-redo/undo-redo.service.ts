import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private readonly initialActionPosition: number = -1;
    context: CanvasRenderingContext2D;
    preview: CanvasRenderingContext2D;
    shortcutUndo: ShortcutKey;
    shortcutRedo: ShortcutKey;
    originalResize: ResizeDraw;

    originalCanvas: HTMLCanvasElement;

    blockUndoRedo: boolean = true;

    commands: AbstractDraw[] = [];
    currentAction: number = this.initialActionPosition;

    constructor() {
        this.shortcutRedo = new ShortcutKey('z', true, true, false);
        this.shortcutUndo = new ShortcutKey('z', true);
    }

    init(context: CanvasRenderingContext2D, preview: CanvasRenderingContext2D, originalResize: ResizeDraw): void {
        this.commands = [];
        this.currentAction = this.initialActionPosition;

        this.originalResize = originalResize;
        this.preview = preview;
        this.context = context;

        this.originalCanvas = document.createElement('canvas');
        this.originalCanvas.height = this.context.canvas.height;
        this.originalCanvas.width = this.context.canvas.width;

        const tempCtx = this.originalCanvas.getContext('2d') as CanvasRenderingContext2D;
        tempCtx.drawImage(this.context.canvas, 0, 0);
    }

    saveCommand(command: AbstractDraw): void {
        this.commands.splice(this.currentAction + 1);

        this.commands.push(command);
        this.currentAction += 1;
    }

    undo(): void {
        if (this.blockUndoRedo) return;
        if (this.currentAction < 0) return;

        this.currentAction -= 1;

        this.originalResize.execute(this.context);
        this.context.drawImage(this.originalCanvas, 0, 0);

        for (let i = 0; i <= this.currentAction; i++) {
            this.commands[i].execute(this.context);
        }
    }

    redo(): void {
        if (this.blockUndoRedo) return;
        if (this.currentAction >= this.commands.length - 1) return;

        this.currentAction += 1;

        this.commands[this.currentAction].execute(this.context);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.shortcutRedo.equals(event)) this.redo();
        else if (this.shortcutUndo.equals(event)) this.undo();
    }
}
