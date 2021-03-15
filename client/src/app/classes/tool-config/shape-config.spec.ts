import { ShapeConfig } from './shape-config';
describe('ShapeConfig', () => {
    let config: ShapeConfig;
    beforeEach(() => {
        config = new ShapeConfig();
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });
});
