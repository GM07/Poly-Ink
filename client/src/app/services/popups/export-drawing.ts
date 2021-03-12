import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    shortcut: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.showPopup = false;
        this.shortcut = new ShortcutKey('e', true);
    }

    exportImage(image: string, format: string, name: string): void {
        const downloadElement = document.createElement('a');
        downloadElement.download = name + '.' + format;
        downloadElement.href = image;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
}
