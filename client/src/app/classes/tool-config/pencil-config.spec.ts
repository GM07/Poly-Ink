import { PencilConfig } from '@app/classes/tool-config/pencil-config';
describe('PencilConfig', () => {
    let pencilConfig: PencilConfig;
    beforeEach(() => {
        pencilConfig = new PencilConfig();
        pencilConfig.pathData[0].push({ x: 0, y: 0 });
    });

    it('should clone pathData properly', () => {
        const newConfig = pencilConfig.clone();
        expect(newConfig.pathData[0][0]).not.toBe(pencilConfig.pathData[0][0]);
    });
});
