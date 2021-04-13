import { Component } from '@angular/core';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { TextService } from '@app/services/tools/text.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
})
export class TextComponent {
    private leftMouseDown: boolean;

    constructor(
        public textService: TextService,
        public shortcutHandlerService: ShortcutHandlerService,
        public drawingService: DrawingService,
        public colorService: ColorService,
    ) {
        this.initSubscriptions();
    }

    protected initSubscriptions(): void {
        this.drawingService.changes.subscribe(() => {
            if (this.textService.config.hasInput) {
                this.textService.drawPreview();
                this.shortcutHandlerService.blockShortcuts = true;
                this.drawingService.blockUndoRedo();
            }
        });
        this.textService.escapeClicked.subscribe(() => {
            this.shortcutHandlerService.blockShortcuts = false;
        });
        this.colorService.changedPrimary.subscribe(() => {
          this.textService.drawPreview();
        });
    }

    onMouseDown(event: MouseEvent): void {
        if (this.shortcutHandlerService.blockShortcuts && !this.textService.config.hasInput) return;
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.textService.isInCanvas(event) && this.leftMouseDown && !this.colorService.isMenuOpen) {
            this.textService.config.hasInput ? this.confirmText() : this.addText(event);
        }
    }

    private confirmText(): void {
        this.textService.confirmText();
        this.shortcutHandlerService.blockShortcuts = false;
    }

    private addText(event: MouseEvent): void {
        this.shortcutHandlerService.blockShortcuts = true;
        this.textService.config.hasInput = true;
        this.textService.config.startCoords.x = event.offsetX;
        this.textService.config.startCoords.y = event.offsetY;
        this.textService.drawPreview();
    }
}
