import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { RectangleDraw } from './rectangle-draw';

// tslint:disable:no-string-literal

describe('RectangleDraw', () => {
    let rectangleDraw: RectangleDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        rectangleDraw = new RectangleDraw(colorService, new ShapeConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        rectangleDraw['config'].lineWidth = 1;

        const startPoint: Vec2 = { x: 0, y: 0 };
        const endPoint: Vec2 = { x: 10, y: 20 };

        rectangleDraw['config'].startCoords = startPoint;
        rectangleDraw['config'].endCoords = endPoint;
    });

    it('should construct properly', () => {
        expect(rectangleDraw).toBeDefined();
        expect(rectangleDraw['primaryRgba']).toEqual(Colors.RED.rgbString);
        expect(rectangleDraw['secondaryRgba']).toEqual(Colors.BLUE.rgbString);
        expect(rectangleDraw['config'].shapeMode).toEqual(ShapeMode.FilledWithContour);
        expect(rectangleDraw['config'].lineWidth).toEqual(ToolSettingsConst.MIN_WIDTH);
        expect(rectangleDraw['config'].shiftDown).toBeFalse();
    });

    it('should draw a square when shift is pressed', () => {
        rectangleDraw['config'].shiftDown = true;

        rectangleDraw.execute(ctxStub);

        // tslint:disable-next-line:no-magic-numbers
        let imageData: ImageData = ctxStub.getImageData(10, 20, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).toEqual(0); // A

        // tslint:disable-next-line:no-magic-numbers
        imageData = ctxStub.getImageData(5, 5, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should do nothing with an unknown mode', () => {
        rectangleDraw['config'].shapeMode = {} as ShapeMode;

        rectangleDraw.execute(ctxStub);

        // tslint:disable-next-line:no-magic-numbers
        const imageData = ctxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for contour drawing type', () => {
        rectangleDraw['config'].shapeMode = ShapeMode.Contour;

        rectangleDraw.execute(ctxStub);

        // Border is present
        let imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        // Inside is untouched
        // tslint:disable-next-line:no-magic-numbers
        imageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        rectangleDraw['config'].shapeMode = ShapeMode.Filled;
        rectangleDraw.execute(ctxStub);

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled with contour drawing type', () => {
        rectangleDraw['config'].shapeMode = ShapeMode.FilledWithContour;
        rectangleDraw['config'].lineWidth = 2;
        rectangleDraw.execute(ctxStub);

        // Border is present
        let imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        // Inside is present
        // tslint:disable-next-line:no-magic-numbers
        imageData = ctxStub.getImageData(2, 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
