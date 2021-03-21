import { AerosolConfig } from './aerosol-config';
describe('PencilConfig', () => {
    let config: AerosolConfig;
    beforeEach(() => {
        config = new AerosolConfig();
        config.points.push({ x: 0, y: 0 });
        config.seeds.push('test');
    });

    it('should clone droplets properly', () => {
        const newSeed = 'newSeed';
        const newConfig = config.clone();
        config.seeds[0] = newSeed;
        expect(newConfig.points[0]).not.toBe(config.points[0]);
        expect(newConfig.seeds[0]).not.toBe(config.seeds[0]);
    });
});
