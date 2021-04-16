import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PolygonDraw } from '@app/classes/commands/polygon-draw';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/constants/colors';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from '@app/services/color/color.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('PolygonDraw', () => {
    let polygonDraw: PolygonDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryColor: Colors.RED, secondaryColor: Colors.BLUE, primaryColorAlpha: 1.0, secondaryColorAlpha: 1.0 } as ColorService;
        polygonDraw = new PolygonDraw(colorService, new ShapeConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        const startPoint: Vec2 = new Vec2(0, 0);
        const endPoint: Vec2 = new Vec2(15, 15);

        polygonDraw['config'].startCoords = startPoint;
        polygonDraw['config'].endCoords = endPoint;
    });

    it('should draw preview circle', () => {
        polygonDraw['config'].shapeMode = ShapeMode.Contour;
        polygonDraw['config'].showPerimeter = true;

        const middle: Vec2 = polygonDraw['config'].endCoords.substract(polygonDraw['config'].startCoords).scalar(1 / 2);

        polygonDraw['drawCirclePerimeter'](ctxStub, new Vec2(middle.x, middle.y), middle.x);

        const previewImageData = ctxStub.getImageData(middle.x, 0, 1, 1);
        expect(previewImageData.data[ALPHA]).not.toEqual(0); // A

        const voidImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(voidImageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for contour drawing type', () => {
        polygonDraw['config'].shapeMode = ShapeMode.Contour;

        polygonDraw.execute(ctxStub);

        const middle: Vec2 = polygonDraw['config'].endCoords.substract(polygonDraw['config'].startCoords).scalar(1 / 2);

        let imageData: ImageData = ctxStub.getImageData(middle.x, 0, 1, 1);

        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(middle.x, middle.y, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        polygonDraw['config'].shapeMode = ShapeMode.Filled;

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;

        const imageData: ImageData = ctxStub.getImageData(middleX, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a triangle', () => {
        polygonDraw['config'].shapeMode = ShapeMode.FilledWithContour;
        polygonDraw['config'].lineWidth = 2;

        polygonDraw.execute(ctxStub);

        const middle: Vec2 = polygonDraw['config'].endCoords.substract(polygonDraw['config'].startCoords).scalar(1 / 2);

        let imageData: ImageData = ctxStub.getImageData(middle.x, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(0, middle.y, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A

        imageData = ctxStub.getImageData(middle.x, middle.y, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a square', () => {
        polygonDraw['config'].shapeMode = ShapeMode.FilledWithContour;

        // tslint:disable-next-line:no-magic-numbers
        polygonDraw['config'].numEdges = 4;
        // tslint:disable-next-line:no-magic-numbers
        polygonDraw['config'].lineWidth = 4;

        polygonDraw.execute(ctxStub);

        const middle: Vec2 = polygonDraw['config'].endCoords.substract(polygonDraw['config'].startCoords).scalar(1 / 2);

        let imageData: ImageData = ctxStub.getImageData(middle.x, 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(2, middle.y, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(middle.x, middle.y, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should call drawRectanglePerimeter when showPerimeter is set', () => {
        spyOn<any>(polygonDraw, 'drawCirclePerimeter').and.stub();
        polygonDraw['config'].showPerimeter = true;
        polygonDraw.execute(ctxStub);
        expect(polygonDraw['drawCirclePerimeter']).toHaveBeenCalled();
    });

    it('should draw polygon left properly', () => {
        polygonDraw['config'].shapeMode = ShapeMode.Filled;
        polygonDraw['config'].startCoords = new Vec2(15, 15);
        polygonDraw['config'].endCoords = new Vec2(0, 0);

        polygonDraw.execute(ctxStub);
        const middle: Vec2 = polygonDraw['config'].startCoords.substract(polygonDraw['config'].endCoords).scalar(1 / 2);

        const imageData: ImageData = ctxStub.getImageData(middle.x, middle.y, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should reduce border size if to big to show fully', () => {
        polygonDraw['config'].lineWidth = ToolSettingsConst.MAX_WIDTH;
        polygonDraw.execute(ctxStub);

        expect(ctxStub.lineWidth).toBeLessThan(polygonDraw['config'].lineWidth);
    });
});
