import { TextConfig } from './text-config';

describe('StampConfig', () => {
    let config: TextConfig;
    beforeEach(() => {
        config = new TextConfig();
    });

    it('should create an instance', () => {
        expect(new TextConfig()).toBeTruthy();
    });

    it('should clone properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
    });
});
