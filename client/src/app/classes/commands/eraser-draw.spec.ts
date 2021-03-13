import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { EraserDraw } from './eraser-draw';

describe('EraserDraw', () => {
    let eraserDraw: EraserDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const WHITE = 255;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.BLACK.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        eraserDraw = new EraserDraw(colorService, new PencilConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should construct properly', () => {
        expect(eraserDraw).toBeDefined();
        expect(eraserDraw.primaryRgba).toEqual(Colors.BLACK.rgbString);
        expect(eraserDraw.secondaryRgba).toEqual(Colors.BLUE.rgbString);
        expect(eraserDraw.eraserConfig.lineWidth).toEqual(ToolSettingsConst.DEFAULT_PENCIL_WIDTH);
        expect(eraserDraw.eraserConfig.pathData).toEqual([[]]);
    });

    it('Should draw a single pixel if the smallest size was selected', () => {
        eraserDraw.eraserConfig.lineWidth = 1;

        const point: Vec2 = { x: 0, y: 0 };
        eraserDraw.eraserConfig.pathData[0].push(point);
        eraserDraw.execute(ctxStub);

        // First pixel only
        const imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    // Useful integration test example
    it(' should change the pixel of the canvas ', () => {
        const point1: Vec2 = { x: 0, y: 0 };
        const point2: Vec2 = { x: 5, y: 5 };
        eraserDraw.eraserConfig.pathData[0].push(point1);
        eraserDraw.eraserConfig.pathData[0].push(point2);
        eraserDraw.eraserConfig.pathData.push([]);
        eraserDraw.execute(ctxStub);

        // First pixel only
        const imageData: ImageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
