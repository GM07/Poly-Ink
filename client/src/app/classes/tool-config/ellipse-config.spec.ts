import { EllipseConfig } from './ellipse-config';
describe('EllipseConfig', () => {
    let config: EllipseConfig;
    beforeEach(() => {
        config = new EllipseConfig();
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });
});
