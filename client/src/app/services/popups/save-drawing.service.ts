import { Injectable } from '@angular/core';
import { Popup } from '@app/classes/popup';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SpecialKeys } from '@app/classes/shortcut/special-keys';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService implements Popup {
    SHORTCUT: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.SHORTCUT = new ShortcutKey('s', { ctrlKey: true } as SpecialKeys);
        this.showPopup = false;
    }
}
