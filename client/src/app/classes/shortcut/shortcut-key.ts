export class ShortcutKey {
    isDown: boolean;

    constructor(public key: string, public ctrlKey: boolean = false, public shiftKey: boolean = false, public altKey: boolean = false) {
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
            equals = equals && (this.ctrlKey === event.ctrlKey || !this.ctrlKey);
            equals = equals && (this.shiftKey === event.shiftKey || !this.shiftKey);
            equals = equals && (this.altKey === event.altKey || !this.altKey);
        } else {
            equals = equals && this.ctrlKey === event.ctrlKey;
            equals = equals && this.shiftKey === event.shiftKey;
            equals = equals && this.altKey === event.altKey;
        }
        return equals && this.key === event.key.toLocaleLowerCase();
    }
}
