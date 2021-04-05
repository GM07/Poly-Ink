import { Vec2 } from '@app/classes/vec2';
import { BucketConfig } from './bucket-config';
describe('BucketConfig', () => {
    let config: BucketConfig;
    beforeEach(() => {
        config = new BucketConfig();
        config.point = new Vec2(0, 0);
    });

    it('should clone point properly', () => {
        const newConfig = config.clone();
        expect(newConfig.point).not.toBe(config.point);
    });
});
