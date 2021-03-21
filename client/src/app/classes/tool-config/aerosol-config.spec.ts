import { AerosolConfig } from './aerosol-config';
describe('PencilConfig', () => {
    let config: AerosolConfig;
    beforeEach(() => {
        config = new AerosolConfig();
        config.points.push({ x: 0, y: 0 });
    });

    it('should clone droplets properly', () => {
        const newConfig = config.clone();
        expect(newConfig.points[0]).not.toBe(config.points[0]);
    });
});
