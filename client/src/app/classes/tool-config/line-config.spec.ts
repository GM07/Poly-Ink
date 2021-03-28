import { Vec2 } from '@app/classes/vec2';
import { LineConfig } from './line-config';
describe('LineConfig', () => {
    let lineConfig: LineConfig;
    beforeEach(() => {
        lineConfig = new LineConfig();
        lineConfig.points.push(new Vec2(0, 0));
    });

    it('should clone points properly', () => {
        const newConfig = lineConfig.clone();
        expect(newConfig.points[0]).not.toBe(lineConfig.points[0]);
    });
});
