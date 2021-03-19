import { PolygonConfig } from './polygon-config';

describe('PolygonConfig', () => {
    let config: PolygonConfig;
    beforeEach(() => {
        config = new PolygonConfig();
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });
});
