import { ResizeConfig } from './resize-config';

describe('Resize Config', () => {
    it('Should clone', () => {
        const config = new ResizeConfig();
        config.width = 2;
        config.height = 2;
        const clone = config.clone();
        expect(clone.width).toBe(2);
        expect(clone.height).toBe(2);
    });
});
