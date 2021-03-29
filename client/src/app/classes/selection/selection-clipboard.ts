import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

export class SelectionClipboard {
    private readonly COPY: ShortcutKey = new ShortcutKey('c', true);
    private readonly PASTE: ShortcutKey = new ShortcutKey('v', true);
    private readonly CUT: ShortcutKey = new ShortcutKey('x', true);
    private readonly DELETE: ShortcutKey = new ShortcutKey('delete');

    private savedDrawing: HTMLCanvasElement;

    constructor(private selectionService: AbstractSelectionService) {
        this.savedDrawing = document.createElement('canvas');
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.COPY.equals(event)) {
            console.log('copy');
            this.copyDrawing();
        } else if (this.PASTE.equals(event)) {
            console.log('paste');
        } else if (this.CUT.equals(event)) {
            console.log('cut');
            this.copyDrawing();
            this.deleteDrawing();
        } else if (this.DELETE.equals(event)) {
            console.log('delete');
            this.deleteDrawing();
        }
    }

    copyDrawing(): void {
        const ctx = this.selectionService.config.selectionCtx;
        if (ctx === null) return;

        const canvas = ctx.canvas;
        DrawingService.saveCanvas(this.savedDrawing, canvas);
    }

    pasteDrawing(): void {}

    deleteDrawing(): void {
        const ctx = this.selectionService.config.selectionCtx;
        if (ctx === null) return;

        const canvas = ctx.canvas;
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        this.selectionService.stopDrawing();
    }
}
