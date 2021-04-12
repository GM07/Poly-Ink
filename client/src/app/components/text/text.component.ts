import { Component } from '@angular/core';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
})
export class TextComponent {
    // private leftMouseDown: boolean;
    // constructor(
    //     public textService: TextService,
    //     public shortcutHandlerService: ShortcutHandlerService,
    //     public drawingService: DrawingService,
    //     public colorService: ColorService,
    // ) {
    //     this.initSubscriptions();
    // }
    // protected initSubscriptions(): void {
    //     this.drawingService.changes.subscribe(() => {
    //         if (this.textService.config.hasInput) {
    //             this.textService.drawPreview();
    //             this.shortcutHandlerService.blockShortcuts = true;
    //             this.drawingService.blockUndoRedo();
    //         }
    //     });
    //     this.textService.escapeClicked.subscribe(() => {
    //         this.shortcutHandlerService.blockShortcuts = false;
    //     });
    // }
    // onMouseDown(event: MouseEvent): void {
    //     if (this.shortcutHandlerService.blockShortcuts && !this.textService.config.hasInput) return;
    //     this.leftMouseDown = event.button === MouseButton.Left;
    //     if (this.textService.isInCanvas(event) && this.leftMouseDown && !this.colorService.isMenuOpen) {
    //         this.textService.config.hasInput ? this.confirmText() : this.addText(event);
    //     }
    // }
    // private confirmText(): void {
    //     this.textService.confirmText();
    //     this.shortcutHandlerService.blockShortcuts = false;
    // }
    // private addText(event: MouseEvent): void {
    //     this.shortcutHandlerService.blockShortcuts = true;
    //     this.textService.config.hasInput = true;
    //     this.textService.config.startCoords.x = event.offsetX;
    //     this.textService.config.startCoords.y = event.offsetY;
    //     this.textService.drawPreview();
    // }
}
