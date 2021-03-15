import { RectangleConfig } from '@app/classes/tool-config/rectangle-config';
describe('RectangleConfig', () => {
    let config: RectangleConfig;
    beforeEach(() => {
        config = new RectangleConfig();
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });
});
