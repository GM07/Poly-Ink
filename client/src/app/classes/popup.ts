import { ShortcutKey } from './shortcut/shortcut-key';

export interface Popup {
    readonly shortcut: ShortcutKey;
    showPopup: boolean;
}
