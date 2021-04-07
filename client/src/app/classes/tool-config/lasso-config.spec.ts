import { Vec2 } from '../vec2';
import { LassoConfig } from './lasso-config';

describe('LassoConfig', () => {
    let config: LassoConfig;
    beforeEach(() => {
        config = new LassoConfig();
        config.points = [new Vec2(0, 0), new Vec2(0, 0)];
        config.originalPoints = [new Vec2(0, 0), new Vec2(0, 0)];
    });

    it('should clone start and end point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.startCoords).not.toBe(config.startCoords);
        expect(newConfig.endCoords).not.toBe(config.endCoords);
    });

    it('should clone the points', () => {
        const newConfig = config.clone();
        expect(newConfig.points.length).toEqual(2);
        expect(newConfig.originalPoints.length).toEqual(2);
    });
});
