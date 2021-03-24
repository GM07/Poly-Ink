import { StampConfig } from '@app/classes/tool-config/stamp-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { StampDraw } from './stamp-draw';

// tslint:disable:no-string-literal

describe('StampDraw', () => {
    let stampDraw: StampDraw;
    let colorService: ColorService;
    let stampConfig: StampConfig;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        stampConfig = new StampConfig();
        spyOn(stampConfig, 'clone').and.returnValue(new StampConfig());
        stampDraw = new StampDraw(colorService, stampConfig);
    });

    it('should create an instance', () => {
        expect(stampDraw).toBeTruthy();
    });

    it('execute should draw', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        stampDraw['config'].position = { x: 0, y: 0 } as Vec2;
        spyOn(ctx, 'translate');
        spyOn(ctx, 'rotate');
        spyOn(ctx, 'drawImage');
        stampDraw.execute(ctx);
        expect(ctx.translate).toHaveBeenCalled();
        expect(ctx.translate).toHaveBeenCalledTimes(2);
        expect(ctx.rotate).toHaveBeenCalled();
        expect(ctx.rotate).toHaveBeenCalledTimes(2);
        expect(ctx.drawImage).toHaveBeenCalled();
    });
});
