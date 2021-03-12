import { Component, HostListener } from '@angular/core';
import { NewDrawingService } from '@app/services/popups/new-drawing';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-canvas-reset',
    templateUrl: './canvas-reset.component.html',
    styleUrls: ['./canvas-reset.component.scss'],
})
export class NewDrawingComponent {
    constructor(private newDrawing: NewDrawingService, private shortcutHandler: ShortcutHandlerService) {}

    hidePopup(): void {
        this.newDrawing.showPopup = false;
        this.shortcutHandler.blockShortcuts = false;
    }

    canShowPopup(): boolean {
        return this.newDrawing.showPopup;
    }

    createNewDrawing(confirm: boolean): void {
        this.newDrawing.newCanvas(confirm);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.shortcutHandler.blockShortcuts && this.newDrawing.shortcut.equals(event)) {
            event.preventDefault();
            this.newDrawing.newCanvas();
            if (this.newDrawing.showPopup) this.shortcutHandler.blockShortcuts = true;
        }
    }
}
