import { TestBed } from '@angular/core/testing';
import { ShortcutKey } from '@app/classes/shortcut-key';

describe('ShortcutKey', () => {
    let shortcutKey: ShortcutKey;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        shortcutKey = new ShortcutKey('c', false, false, false);
    });

    it('should be created', () => {
        expect(shortcutKey).toBeTruthy();
    });

    it('checks if a key event equals to the shortcut', () => {
        let event: KeyboardEvent = { key: 'l' } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
        event = { key: 'c', ctrlKey: true } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
    });

    it('allows for shortcuts with ctrl', () => {
        shortcutKey.ctrlKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });

    it('allows for shortcuts with shift', () => {
        shortcutKey.shiftKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: true, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });

    it('allows for shortcuts with alt', () => {
        shortcutKey.altKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: false, altKey: true } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });
});
