import { SpecialKeys } from '@app/classes/shortcut/special-keys';

export class ShortcutKey {
    isDown: boolean;
    specialKeys: SpecialKeys;

    constructor(public key: string, specialKeysIn: SpecialKeys = {}) {
        this.specialKeys = { ctrlKey: false, shiftKey: false, altKey: false } as SpecialKeys;
        this.specialKeys = { ...this.specialKeys, ...specialKeysIn } as SpecialKeys;
        this.isDown = false;
    }

    static contains(shortcutList: ShortcutKey[], event: KeyboardEvent, ignoreOtherKeys: boolean = false): boolean {
        if (event.key === undefined) return false;

        for (const shortcut of shortcutList) {
            if (shortcut.equals(event, ignoreOtherKeys)) {
                return true;
            }
        }
        return false;
    }

    static get(shortcutList: ShortcutKey[], event: KeyboardEvent, ignoreOtherKeys: boolean = false): ShortcutKey | undefined {
        if (event.key === undefined) return undefined;

        for (const shortcut of shortcutList) {
            if (shortcut.equals(event, ignoreOtherKeys)) {
                return shortcut;
            }
        }
        return undefined;
    }

    equals(event: KeyboardEvent, ignoreOtherKeys: boolean = false): boolean {
        if (event.key === undefined) return false;

        let equals = true;

        if (ignoreOtherKeys) {
            equals = equals && (this.specialKeys.ctrlKey === event.ctrlKey || !this.specialKeys.ctrlKey);
            equals = equals && (this.specialKeys.shiftKey === event.shiftKey || !this.specialKeys.shiftKey);
            equals = equals && (this.specialKeys.altKey === event.altKey || !this.specialKeys.altKey);
        } else {
            equals = equals && this.specialKeys.ctrlKey === event.ctrlKey;
            equals = equals && this.specialKeys.shiftKey === event.shiftKey;
            equals = equals && this.specialKeys.altKey === event.altKey;
        }
        return equals && this.key === event.key.toLocaleLowerCase();
    }

    clone(): ShortcutKey {
        const shortcut = new ShortcutKey(this.key, { ...this.specialKeys } as SpecialKeys);
        shortcut.isDown = this.isDown;
        return shortcut;
    }
}
