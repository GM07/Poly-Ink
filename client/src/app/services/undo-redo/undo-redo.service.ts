import { Injectable } from '@angular/core';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private readonly initialActionPosition: number = -1;
    private blockUndoRedoIn: boolean;
    readonly BLOCK_UNDO_ICON: Subject<boolean> = new Subject<boolean>();
    readonly BLOCK_REDO_ICON: Subject<boolean> = new Subject<boolean>();

    context: CanvasRenderingContext2D;
    preview: CanvasRenderingContext2D;
    shortcutUndo: ShortcutKey;
    shortcutRedo: ShortcutKey;
    originalResize: ResizeDraw;

    originalCanvas: HTMLCanvasElement;

    commands: AbstractDraw[];
    currentAction: number;

    constructor() {
        this.shortcutRedo = new ShortcutKey('z', true, true, false);
        this.shortcutUndo = new ShortcutKey('z', true);
        this.reset();
    }

    init(context: CanvasRenderingContext2D, preview: CanvasRenderingContext2D, originalResize: ResizeDraw): void {
        this.reset();

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
        this.sendIconSignals();
    }

    undo(): void {
        if (this.blockUndoRedo) return;
        if (this.currentAction < 0) return;

        this.currentAction -= 1;

        this.originalResize.execute();
        this.context.drawImage(this.originalCanvas, 0, 0);

        for (let i = 0; i <= this.currentAction; i++) {
            this.commands[i].execute(this.context);
        }

        this.sendIconSignals();
    }

    redo(): void {
        if (this.blockUndoRedo) return;
        if (this.currentAction >= this.commands.length - 1) return;

        this.currentAction += 1;

        this.commands[this.currentAction].execute(this.context);
        this.sendIconSignals();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.shortcutRedo.equals(event)) this.redo();
        else if (this.shortcutUndo.equals(event)) this.undo();
    }

    reset(): void {
        this.blockUndoRedo = true;
        this.commands = [];
        this.currentAction = this.initialActionPosition;
    }

    get blockUndoRedo(): boolean {
        return this.blockUndoRedoIn;
    }

    set blockUndoRedo(block: boolean) {
        this.blockUndoRedoIn = block;
        this.BLOCK_UNDO_ICON.next(block);
        this.BLOCK_REDO_ICON.next(block);
    }

    private sendIconSignals(): void {
        this.BLOCK_UNDO_ICON.next(this.currentAction < 0);
        this.BLOCK_REDO_ICON.next(this.currentAction >= this.commands.length - 1);
    }
}
