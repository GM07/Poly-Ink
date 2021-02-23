import { Component, HostListener } from '@angular/core';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent {

  constructor(private popupHandlerService: PopupHandlerService, private shortcutHandler: ShortcutHandlerService) {
  }

  removePopup(): void {
    this.popupHandlerService.removeExportDrawingPopup();
  }

  showPopup(): boolean {
    return this.popupHandlerService.showExportDrawingPopup();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.popupHandlerService.newDrawing.shortcut.equals(event)) {
      event.preventDefault();
      this.popupHandlerService.newDrawing.newCanvas();
      this.shortcutHandler.blockShortcuts = true;
  }

  }
}
