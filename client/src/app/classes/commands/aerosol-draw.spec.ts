import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { AerosolDraw } from './aerosol-draw';
describe('AerosolDraw', () => {
    let aerosolDraw: AerosolDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    // tslint:disable:no-string-literal
    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        aerosolDraw = new AerosolDraw(colorService, new AerosolConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should draw droplets in the right positions', () => {
        aerosolDraw['config'].droplets = [
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
            [{ x: 2, y: 2 }],
        ];

        aerosolDraw.execute(ctxStub);

        let imageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r);
        expect(imageData.data[1]).toEqual(Colors.RED.g);
        expect(imageData.data[2]).toEqual(Colors.RED.b);

        imageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r);
        expect(imageData.data[1]).toEqual(Colors.RED.g);
        expect(imageData.data[2]).toEqual(Colors.RED.b);

        imageData = ctxStub.getImageData(2, 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r);
        expect(imageData.data[1]).toEqual(Colors.RED.g);
        expect(imageData.data[2]).toEqual(Colors.RED.b);
    });
});
