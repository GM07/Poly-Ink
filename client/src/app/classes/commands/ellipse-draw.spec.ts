import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EllipseConfig, EllipseMode } from '@app/classes/tool-config/ellipse-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { EllipseDraw } from './ellipse-draw';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('EllipseDraw', () => {
    let ellipseDraw: EllipseDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        ellipseDraw = new EllipseDraw(colorService, new EllipseConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        ellipseDraw.config.lineWidth = 1;

        const startPoint: Vec2 = { x: 0, y: 0 };
        const endPoint: Vec2 = { x: 10, y: 20 };

        ellipseDraw.config.startCoords = startPoint;
        ellipseDraw.config.endCoords = endPoint;
    });

    it('should allow for contour drawing type', () => {
        ellipseDraw.config.ellipseMode = EllipseMode.Contour;
        ellipseDraw.execute(ctxStub);

        const xMiddlePoint = (ellipseDraw.config.endCoords.x - ellipseDraw.config.startCoords.x) / 2;
        const yMiddlePoint = (ellipseDraw.config.endCoords.y - ellipseDraw.config.startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(xMiddlePoint, 0, 1, 1);

        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // As

        imageData = ctxStub.getImageData(xMiddlePoint, yMiddlePoint, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        ellipseDraw.config.ellipseMode = EllipseMode.Filled;
        ellipseDraw.execute(ctxStub);

        const xMiddlePoint = (ellipseDraw.config.endCoords.x - ellipseDraw.config.startCoords.x) / 2;

        const imageData: ImageData = ctxStub.getImageData(xMiddlePoint, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled with contour drawing type', () => {
        ellipseDraw.config.ellipseMode = EllipseMode.FilledWithContour;
        ellipseDraw.config.lineWidth = 2;
        ellipseDraw.execute(ctxStub);

        const xMiddlePoint = (ellipseDraw.config.endCoords.x - ellipseDraw.config.startCoords.x) / 2;
        const yMiddlePoint = (ellipseDraw.config.endCoords.y - ellipseDraw.config.startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(xMiddlePoint, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(xMiddlePoint, yMiddlePoint, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should do nothing with an unknown mode', () => {
        ellipseDraw.config.ellipseMode = {} as EllipseMode;
        ellipseDraw.execute(ctxStub);

        const imageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should draw a circle when shift is pressed', () => {
        ellipseDraw.config.shiftDown = true;
        ellipseDraw.config.ellipseMode = EllipseMode.FilledWithContour;

        ellipseDraw.execute(ctxStub);

        const xMiddlePoint = (ellipseDraw.config.endCoords.x - ellipseDraw.config.startCoords.x) / 2;
        const yMiddlePoint = (ellipseDraw.config.endCoords.y - ellipseDraw.config.startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(ellipseDraw.config.endCoords.x, yMiddlePoint, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A

        imageData = ctxStub.getImageData(ellipseDraw.config.endCoords.x, xMiddlePoint, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should call drawRectanglePerimeter when showPerimeter is set', () => {
        spyOn<any>(ellipseDraw, 'drawRectanglePerimeter').and.stub();
        ellipseDraw.config.showPerimeter = true;
        ellipseDraw.execute(ctxStub);
        expect(ellipseDraw['drawRectanglePerimeter']).toHaveBeenCalled();
    });

    it('should draw rectangle perimeter properly', () => {
        // tslint:disable-next-line:no-magic-numbers
        ellipseDraw['drawRectanglePerimeter'](ctxStub, 6, 6, 5, 5);

        const imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should draw rectangle perimeter properly with filled type', () => {
        ellipseDraw.config.ellipseMode = EllipseMode.Filled;
        // tslint:disable-next-line:no-magic-numbers
        ellipseDraw['drawRectanglePerimeter'](ctxStub, 5, 5, 5, 5);

        const imageData: ImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });
});
