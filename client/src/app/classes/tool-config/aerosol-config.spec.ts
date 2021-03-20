import { AerosolConfig } from './aerosol-config';
describe('PencilConfig', () => {
    let config: AerosolConfig;
    beforeEach(() => {
        config = new AerosolConfig();
        config.droplets.push([]);
        config.droplets[0].push({ x: 0, y: 0 });
    });

    it('should clone droplets properly', () => {
        const newConfig = config.clone();
        expect(newConfig.droplets[0][0]).not.toBe(config.droplets[0][0]);
    });
});
