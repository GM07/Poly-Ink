import { ShortcutKey } from './shortcut-key';

export class ShiftKey extends ShortcutKey {
    constructor() {
        super('shift');
    }

    equals(event: KeyboardEvent): boolean {
        return super.equals(event, true);
    }
}
