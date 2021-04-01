import { ShortcutKey } from './shortcut-key';

export class ShiftKey extends ShortcutKey {
    constructor() {
        super('shift');
    }

    equals(event: KeyboardEvent): boolean {
        return super.equals(event, true);
    }

    clone(): ShiftKey {
        const shiftKey = new ShiftKey();
        shiftKey.isDown = this.isDown;
        return shiftKey;
    }
}
