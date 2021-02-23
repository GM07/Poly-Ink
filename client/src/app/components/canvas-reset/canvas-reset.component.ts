import { Component, HostListener } from '@angular/core';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';

@Component({
    selector: 'app-canvas-reset',
    templateUrl: './canvas-reset.component.html',
    styleUrls: ['./canvas-reset.component.scss'],
})
export class NewDrawingComponent {

    constructor(private popupHandlerService: PopupHandlerService, private shortcutHandler: ShortcutHandlerService) {
    }

    removePopup(): void {
        this.popupHandlerService.removeNewDrawingPopup();
    }

    showPopup(): boolean {
        return this.popupHandlerService.showNewDrawingPopup();
    }

    createNewDrawing(confirm: boolean): void {
        this.popupHandlerService.removeNewDrawingPopup();
        this.popupHandlerService.newDrawing.newCanvas(confirm);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.popupHandlerService.newDrawing.shortcut.equals(event)) {
            event.preventDefault();
            this.popupHandlerService.newDrawing.newCanvas();
            console.log('new drawing');
            this.shortcutHandler.blockShortcuts = true;
        }
    }
}
