import { Injectable } from '@angular/core';
import { Popup } from '@app/classes/popup';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService implements Popup {
    shortcut: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.shortcut = new ShortcutKey('s', true);
        this.showPopup = false;
    }
}
