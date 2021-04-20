import { ShiftKey } from './shift-key';

describe('Shift Key', () => {
    it('should clone', () => {
        const shiftKey = new ShiftKey();
        shiftKey.isDown = true;
        expect(shiftKey.clone().isDown).toBeTrue();
    });
});
