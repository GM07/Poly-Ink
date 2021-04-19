import { Injectable } from '@angular/core';
import { Popup } from '@app/classes/popup';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SpecialKeys } from '@app/classes/shortcut/special-keys';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService implements Popup {
    SHORTCUT: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.SHORTCUT = new ShortcutKey('e', { ctrlKey: true } as SpecialKeys);
        this.showPopup = false;
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
