import { SelectionConfig } from './selection-config';

describe('SelectionConfig', () => {
    let config: SelectionConfig;
    beforeEach(() => {
        config = new SelectionConfig();
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });
});
