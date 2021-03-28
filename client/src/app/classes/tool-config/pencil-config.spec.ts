import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { Vec2 } from '@app/classes/vec2';
describe('PencilConfig', () => {
    let pencilConfig: PencilConfig;
    beforeEach(() => {
        pencilConfig = new PencilConfig();
        pencilConfig.pathData[0].push(new Vec2(0, 0));
    });

    it('should clone pathData properly', () => {
        const newConfig = pencilConfig.clone();
        expect(newConfig.pathData[0][0]).not.toBe(pencilConfig.pathData[0][0]);
    });
});
