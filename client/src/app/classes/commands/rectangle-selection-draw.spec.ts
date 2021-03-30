// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractSelectionDraw } from './abstract-selection-draw';
import { RectangleSelectionDraw } from './rectangle-selection-draw';

describe('RectangleDraw', () => {
    let rectangleSelectionDraw: RectangleSelectionDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        rectangleSelectionDraw = new RectangleSelectionDraw(colorService, new SelectionConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        rectangleSelectionDraw['config'].startCoords = new Vec2(0, 0);
        rectangleSelectionDraw['config'].endCoords = new Vec2(15, 15);
        rectangleSelectionDraw['config'].height = 10;
        rectangleSelectionDraw['config'].originalHeight = 10;
        rectangleSelectionDraw['config'].width = 10;
        rectangleSelectionDraw['config'].originalWidth = 10;

        ctxStub.canvas.width = 100;
        ctxStub.canvas.height = 100;
        ctxStub.fillStyle = Colors.BLACK.rgbString;
        ctxStub.fillRect(0, 0, 10, 10);
    });

    it('should fillbacground with white', () => {
        rectangleSelectionDraw['fillBackground'](ctxStub);
        let imageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(rectangleSelectionDraw['config'].width / 2, rectangleSelectionDraw['config'].height / 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should not fill the background if the selection has not moved', () => {
        const fillSpy = spyOn(ctxStub, 'fill');
        rectangleSelectionDraw['config'].startCoords = new Vec2(0, 0);
        rectangleSelectionDraw['config'].endCoords = new Vec2(0, 0);
        rectangleSelectionDraw['fillBackground'](ctxStub);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('should move selection properly', () => {
        const middle = new Vec2(rectangleSelectionDraw['config'].width / 2, rectangleSelectionDraw['config'].height / 2);
        const pos = rectangleSelectionDraw['config'].endCoords.add(middle);

        rectangleSelectionDraw.execute(ctxStub);

        let imageData = ctxStub.getImageData(pos.x, pos.y, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(middle.x, middle.y, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should make appropriate calls on execute', () => {
        spyOn<any>(rectangleSelectionDraw, 'fillBackground').and.callThrough();
        spyOn<any>(AbstractSelectionDraw, 'saveSelectionToCanvas').and.callThrough();

        rectangleSelectionDraw.execute(ctxStub);

        expect(rectangleSelectionDraw['fillBackground']).toHaveBeenCalled();
        expect(AbstractSelectionDraw.saveSelectionToCanvas).toHaveBeenCalled();
    });

    it('should use the scaling factor when saving the selection to the canvas', () => {
        rectangleSelectionDraw['config'].scaleFactor = { x: -1, y: -1 } as Vec2;
        spyOn(ctxStub, 'getImageData').and.callThrough();
        let canvas = AbstractSelectionDraw.saveSelectionToCanvas(ctxStub, rectangleSelectionDraw['config']);
        expect(canvas).not.toBeUndefined();
        rectangleSelectionDraw['config'].scaleFactor = { x: 1, y: -1 } as Vec2;
        canvas = AbstractSelectionDraw.saveSelectionToCanvas(ctxStub, rectangleSelectionDraw['config']);
        expect(canvas).not.toBeUndefined();
        rectangleSelectionDraw['config'].scaleFactor = { x: -1, y: 1 } as Vec2;
        canvas = AbstractSelectionDraw.saveSelectionToCanvas(ctxStub, rectangleSelectionDraw['config']);
        expect(ctxStub.getImageData).toHaveBeenCalledTimes(3);
        expect(canvas).not.toBeUndefined();
    });
});
