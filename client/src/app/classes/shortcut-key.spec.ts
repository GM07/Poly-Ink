import { async, TestBed } from '@angular/core/testing';
import { ShortcutKey } from '@app/classes/shortcut-key';

describe('ShortcutKey', () => {
    const shortcutKey: ShortcutKey = new ShortcutKey('c', false, false, false);

    beforeEach(async(() => {
        TestBed.configureTestingModule({});
    }));

    it('should be created', () => {
        expect(shortcutKey).toBeTruthy();
    });

    it('checks if a key event equals to the shortcut', () => {
        shortcutKey.key = 'e';
        let event: KeyboardEvent = { key: 'l' } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'e', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
        event = { key: 'e', ctrlKey: true } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
    });
});
