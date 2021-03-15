import { Injectable } from '@angular/core';
import { Popup } from '@app/classes/popup';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService implements Popup {
    shortcut: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.shortcut = new ShortcutKey('s', true);
        this.showPopup = false;
    }

    saveImage(image: string, format: string, name: string): void {
        const downloadElement = document.createElement('a');
        downloadElement.download = name + '.' + format;
        downloadElement.href = image;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
}
