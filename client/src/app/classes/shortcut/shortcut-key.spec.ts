import { TestBed } from '@angular/core/testing';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

describe('ShortcutKey', () => {
    let shortcutKey: ShortcutKey;
    let shortcutKeyArray: ShortcutKey[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        shortcutKey = new ShortcutKey('c');
        shortcutKeyArray = [new ShortcutKey('x'), new ShortcutKey('y'), new ShortcutKey('z'), shortcutKey];
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

    it('checks if a key event equals to the shortcut, while ignoring other inputs', () => {
        let event: KeyboardEvent = { key: 'l' } as KeyboardEvent;
        expect(shortcutKey.equals(event, true)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event, true)).toBeTruthy();
        event = { key: 'c', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event, true)).toBeTruthy();
        event = { key: 'c', ctrlKey: false, shiftKey: true, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event, true)).toBeTruthy();
        event = { key: 'c', ctrlKey: false, shiftKey: false, altKey: true } as KeyboardEvent;
        expect(shortcutKey.equals(event, true)).toBeTruthy();
    });

    it('allows for shortcuts with ctrl', () => {
        shortcutKey.specialKeys.ctrlKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });

    it('allows for shortcuts with shift', () => {
        shortcutKey.specialKeys.shiftKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: true, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });

    it('allows for shortcuts with alt', () => {
        shortcutKey.specialKeys.altKey = true;
        let event: KeyboardEvent = { key: 'c', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeFalsy();
        event = { key: 'c', ctrlKey: false, shiftKey: false, altKey: true } as KeyboardEvent;
        expect(shortcutKey.equals(event)).toBeTruthy();
    });

    it('should return false if an undefined key is searched in an array', () => {
        const event: KeyboardEvent = {} as KeyboardEvent;
        expect(ShortcutKey.contains(shortcutKeyArray, event)).toBeFalsy();
    });

    it('should return false if an unkown key is searched in an array', () => {
        const event: KeyboardEvent = { key: 'unkown' } as KeyboardEvent;
        expect(ShortcutKey.contains(shortcutKeyArray, event)).toBeFalsy();
    });

    it('should return true if a known key is searched in an array', () => {
        const event: KeyboardEvent = { key: 'z', shiftKey: false, ctrlKey: false, altKey: false } as KeyboardEvent;
        expect(ShortcutKey.contains(shortcutKeyArray, event)).toBeTruthy();
    });

    it('should return false if we get an undefined key in an array', () => {
        const event: KeyboardEvent = {} as KeyboardEvent;
        expect(ShortcutKey.get(shortcutKeyArray, event)).toBeUndefined();
    });

    it('should return false if we get an unkown key in an array', () => {
        const event: KeyboardEvent = { key: 'unkown' } as KeyboardEvent;
        expect(ShortcutKey.get(shortcutKeyArray, event)).toBeUndefined();
    });

    it('should return true if we get a known key in an array', () => {
        const event: KeyboardEvent = { key: 'c', shiftKey: false, ctrlKey: false, altKey: false } as KeyboardEvent;
        expect(ShortcutKey.get(shortcutKeyArray, event)).toEqual(shortcutKey);
    });

    it('should clone', () => {
        shortcutKey.isDown = true;
        const clone = shortcutKey.clone();
        expect(clone.isDown).toBe(shortcutKey.isDown);
        expect(clone.key).toBe(shortcutKey.key);
    });
});
