import { TextConfig } from './text-config';

describe('TextConfig', () => {
    let config: TextConfig;
    beforeEach(() => {
        config = new TextConfig();
    });

    it('should create an instance', () => {
        expect(new TextConfig()).toBeTruthy();
    });

    it('should clone startCoords properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.index).not.toBe(config.index);
    });
});
