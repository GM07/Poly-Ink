import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { Vec2 } from '../vec2';

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
            this.pasteDrawing();
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

    pasteDrawing(): void {
        const ctx = this.selectionService.config.selectionCtx;
        if (ctx === null) return;
        this.selectionService.stopDrawing();

        const canvas = ctx.canvas;
        this.selectionService.config.endCoords = new Vec2(0, 0);
        this.selectionService.config.width = this.savedDrawing.width;
        this.selectionService.config.height = this.savedDrawing.height;
        canvas.width = this.savedDrawing.width;
        canvas.height = this.savedDrawing.height;
        ctx.drawImage(this.savedDrawing, 0, 0);
        this.selectionService.UPDATE_POINTS.next(true);
    }

    deleteDrawing(): void {
        const ctx = this.selectionService.config.selectionCtx;
        if (ctx === null) return;

        this.selectionService.config.markedForDelete = true;
        this.selectionService.stopDrawing();
        this.selectionService.config.markedForDelete = false;
    }
}
