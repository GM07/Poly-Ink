import { ShortcutKey } from './shortcut/shortcut-key';

export interface Popup {
    readonly SHORTCUT: ShortcutKey;
    showPopup: boolean;
}
