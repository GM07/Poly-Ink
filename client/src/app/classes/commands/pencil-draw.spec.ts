import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { PencilDraw } from './pencil-draw';
describe('PencilDraw', () => {
    let pencilDraw: PencilDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.BLACK.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        pencilDraw = new PencilDraw(colorService, new PencilConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should construct properly', () => {
        expect(pencilDraw).toBeDefined();
        expect(pencilDraw.primaryRgba).toEqual(Colors.BLACK.rgbString);
        expect(pencilDraw.secondaryRgba).toEqual(Colors.BLUE.rgbString);
        expect(pencilDraw.pencilConfig.lineWidth).toEqual(ToolSettingsConst.DEFAULT_PENCIL_WIDTH);
        expect(pencilDraw.pencilConfig.pathData).toEqual([[]]);
    });

    it('Should draw a single pixel if the smallest size was selected', () => {
        pencilDraw.pencilConfig.lineWidth = 1;

        const point: Vec2 = { x: 0, y: 0 };
        pencilDraw.pencilConfig.pathData[0].push(point);
        pencilDraw.execute(ctxStub);

        // First pixel only
        const imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    // Useful integration test example
    it(' should change the pixel of the canvas ', () => {
        const point1: Vec2 = { x: 0, y: 0 };
        const point2: Vec2 = { x: 3, y: 3 };
        pencilDraw.pencilConfig.pathData[0].push(point1);
        pencilDraw.pencilConfig.pathData[0].push(point2);
        pencilDraw.execute(ctxStub);

        // First pixel only
        const imageData: ImageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
