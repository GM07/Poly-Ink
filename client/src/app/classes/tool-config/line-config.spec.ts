import { LineConfig } from './line-config';
describe('LineConfig', () => {
    let lineConfig: LineConfig;
    beforeEach(() => {
        lineConfig = new LineConfig();
        lineConfig.points.push({ x: 0, y: 0 });
    });

    it('should clone points properly', () => {
        const newConfig = lineConfig.clone();
        expect(newConfig.points[0]).not.toBe(lineConfig.points[0]);
    });
});
