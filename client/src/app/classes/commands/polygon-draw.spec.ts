import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PolygonConfig, PolygonMode } from '@app/classes/tool-config/polygon-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { PolygonDraw } from './polygon-draw';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('PolygonDraw', () => {
    let polygonDraw: PolygonDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        polygonDraw = new PolygonDraw(colorService, new PolygonConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        const startPoint: Vec2 = { x: 0, y: 0 };
        const endPoint: Vec2 = { x: 15, y: 15 };

        polygonDraw['config'].startCoords = startPoint;
        polygonDraw['config'].endCoords = endPoint;
    });

    it('should draw preview circle', () => {
        polygonDraw['config'].polygonMode = PolygonMode.Contour;
        polygonDraw['config'].showPerimeter = true;

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;
        const middleY: number = (polygonDraw['config'].endCoords.y - polygonDraw['config'].startCoords.y) / 2;

        polygonDraw['drawCirclePerimeter'](ctxStub, { x: middleX, y: middleY }, middleX);

        const previewImageData = ctxStub.getImageData(middleX, 0, 1, 1);
        expect(previewImageData.data[ALPHA]).not.toEqual(0); // A

        const voidImageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(voidImageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for contour drawing type', () => {
        polygonDraw['config'].polygonMode = PolygonMode.Contour;

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;
        const middleY: number = (polygonDraw['config'].endCoords.y - polygonDraw['config'].startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(middleX, 0, 1, 1);

        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(middleX, middleY, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        polygonDraw['config'].polygonMode = PolygonMode.Filled;

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;

        const imageData: ImageData = ctxStub.getImageData(middleX, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a triangle', () => {
        polygonDraw['config'].polygonMode = PolygonMode.FilledWithContour;
        polygonDraw['config'].lineWidth = 2;

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;
        const middleY: number = (polygonDraw['config'].endCoords.y - polygonDraw['config'].startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(middleX, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(0, middleY, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A

        imageData = ctxStub.getImageData(middleX, middleY, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.RED.r); // R
        expect(imageData.data[1]).toEqual(Colors.RED.g); // G
        expect(imageData.data[2]).toEqual(Colors.RED.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a square', () => {
        polygonDraw['config'].polygonMode = PolygonMode.FilledWithContour;

        // tslint:disable-next-line:no-magic-numbers
        polygonDraw['config'].numEdges = 4;
        // tslint:disable-next-line:no-magic-numbers
        polygonDraw['config'].lineWidth = 4;

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].endCoords.x - polygonDraw['config'].startCoords.x) / 2;
        const middleY: number = (polygonDraw['config'].endCoords.y - polygonDraw['config'].startCoords.y) / 2;

        let imageData: ImageData = ctxStub.getImageData(middleX, 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(2, middleY, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.BLUE.r); // R
        expect(imageData.data[1]).toEqual(Colors.BLUE.g); // G
        expect(imageData.data[2]).toEqual(Colors.BLUE.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        imageData = ctxStub.getImageData(middleX, middleY, 1, 1);
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
        polygonDraw['config'].polygonMode = PolygonMode.Filled;
        polygonDraw['config'].startCoords = { x: 15, y: 15 };
        polygonDraw['config'].endCoords = { x: 0, y: 0 };

        polygonDraw.execute(ctxStub);

        const middleX: number = (polygonDraw['config'].startCoords.x - polygonDraw['config'].endCoords.x) / 2;
        const middleY: number = (polygonDraw['config'].startCoords.y - polygonDraw['config'].endCoords.y) / 2;

        const imageData: ImageData = ctxStub.getImageData(middleX, middleY, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should reduce border size if to big to show fully', () => {
        polygonDraw['config'].lineWidth = ToolSettingsConst.MAX_WIDTH;
        polygonDraw.execute(ctxStub);

        expect(ctxStub.lineWidth).toBeLessThan(polygonDraw['config'].lineWidth);
    });
});
