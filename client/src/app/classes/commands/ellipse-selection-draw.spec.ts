// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { EllipseSelectionDraw } from './ellipse-selection-draw';

describe('EllipseDraw', () => {
    let ellipseSelectionDraw: EllipseSelectionDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        ellipseSelectionDraw = new EllipseSelectionDraw(colorService, new SelectionConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        ellipseSelectionDraw['config'].startCoords = { x: 0, y: 0 };
        ellipseSelectionDraw['config'].endCoords = { x: 15, y: 15 };
        ellipseSelectionDraw['config'].height = 10;
        ellipseSelectionDraw['config'].width = 10;

        ctxStub.canvas.width = 100;
        ctxStub.canvas.height = 100;
        ctxStub.fillStyle = Colors.BLACK.rgbString;
        ctxStub.fillRect(0, 0, 10, 10);
    });

    it('should fillbacground with white', () => {
        ellipseSelectionDraw['fillBackground'](ctxStub);
        let imageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(ellipseSelectionDraw['config'].width / 2, ellipseSelectionDraw['config'].height / 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should move selection properly', () => {
        const middleX = ellipseSelectionDraw['config'].width / 2;
        const middleY = ellipseSelectionDraw['config'].height / 2;
        const posX = ellipseSelectionDraw['config'].endCoords.x + middleX;
        const posY = ellipseSelectionDraw['config'].endCoords.x + middleY;

        ellipseSelectionDraw.execute(ctxStub);

        let imageData = ctxStub.getImageData(posX, posY, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(middleX, middleY, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should make appropriate calls on execute', () => {
        spyOn<any>(ellipseSelectionDraw, 'fillBackground').and.callThrough();
        spyOn<any>(ellipseSelectionDraw, 'saveSelectionToCanvas').and.callThrough();

        ellipseSelectionDraw.execute(ctxStub);

        expect(ellipseSelectionDraw['fillBackground']).toHaveBeenCalled();
        expect(ellipseSelectionDraw['saveSelectionToCanvas']).toHaveBeenCalled();
    });
});