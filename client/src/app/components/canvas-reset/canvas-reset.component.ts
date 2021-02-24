import { Component, HostListener } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-canvas-reset',
    templateUrl: './canvas-reset.component.html',
    styleUrls: ['./canvas-reset.component.scss'],
})
export class NewDrawingComponent {
    private shortcut: ShortcutKey;

    constructor(private newDrawing: NewDrawingService, private shortcutHandler: ShortcutHandlerService) {
        this.shortcut = new ShortcutKey('o', true);
    }

    removeWarning(): void {
        this.newDrawing.showWarning = false;
        this.shortcutHandler.blockShortcuts = false;
    }

    showWarning(): boolean {
        return this.newDrawing.showWarning;
    }

    createNewDrawing(confirm: boolean): void {
        this.removeWarning();
        this.newDrawing.newCanvas(confirm);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.shortcut.equals(event)) {
            event.preventDefault();
            this.newDrawing.newCanvas();
            if (this.newDrawing.showWarning) this.shortcutHandler.blockShortcuts = true;
        }
    }
}
