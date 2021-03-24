import { Vec2 } from '@app/classes/vec2';
import { StampConfig } from './stamp-config';

describe('StampConfig', () => {
    let config: StampConfig;
    beforeEach(() => {
        config = new StampConfig();
        config.position = { x: 0, y: 0 } as Vec2;
    });

    it('should create an instance', () => {
        expect(new StampConfig()).toBeTruthy();
    });

    it('should clone properly', () => {
        const newConfig = config.clone();
        expect(newConfig.stampImg).not.toBe(config.stampImg);
        expect(newConfig.position).not.toBe(config.position);
    });
});
