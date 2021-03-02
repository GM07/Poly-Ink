import { Component, HostListener } from '@angular/core';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-canvas-reset',
    templateUrl: './canvas-reset.component.html',
    styleUrls: ['./canvas-reset.component.scss'],
})
export class NewDrawingComponent {
    constructor(private popupHandlerService: PopupHandlerService, private shortcutHandler: ShortcutHandlerService) {}

    hidePopup(): void {
        this.popupHandlerService.hideNewDrawingPopup();
        this.shortcutHandler.blockShortcuts = false;
    }

    canShowPopup(): boolean {
        return this.popupHandlerService.canShowNewDrawingPopup();
    }

    createNewDrawing(confirm: boolean): void {
        this.popupHandlerService.hideNewDrawingPopup();
        this.popupHandlerService.newDrawing.newCanvas(confirm);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.popupHandlerService.newDrawing.shortcut.equals(event)) {
            event.preventDefault();
            this.popupHandlerService.newDrawing.newCanvas();
            if (this.popupHandlerService.newDrawing.showPopup) this.shortcutHandler.blockShortcuts = true;
        }
    }
}
