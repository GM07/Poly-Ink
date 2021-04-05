import { ShortcutKey } from './shortcut-key';

export class AltKey extends ShortcutKey {
    constructor() {
        super('alt');
    }

    equals(event: KeyboardEvent): boolean {
        return super.equals(event, true);
    }
}
