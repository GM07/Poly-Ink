// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { EllipseSelectionDraw } from './ellipse-selection-draw';

describe('EllipseSelectionDraw', () => {
    let ellipseSelectionDraw: EllipseSelectionDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryColor: Colors.RED, secondaryColor: Colors.BLUE, primaryColorAlpha: 1.0, secondaryColorAlpha: 1.0 } as ColorService;
        ellipseSelectionDraw = new EllipseSelectionDraw(colorService, new SelectionConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        ellipseSelectionDraw['config'].startCoords = new Vec2(0, 0);
        ellipseSelectionDraw['config'].endCoords = new Vec2(15, 15);
        ellipseSelectionDraw['config'].height = 10;
        ellipseSelectionDraw['config'].originalHeight = 10;
        ellipseSelectionDraw['config'].width = 10;
        ellipseSelectionDraw['config'].originalWidth = 10;

        ctxStub.canvas.width = 100;
        ctxStub.canvas.height = 100;
        ctxStub.fillStyle = Colors.WHITE.rgbString;
        ctxStub.fillRect(0, 0, 100, 100);
        ctxStub.fillStyle = Colors.BLACK.rgbString;
        ctxStub.fillRect(0, 0, 10, 10);

        ellipseSelectionDraw['config'].SELECTION_DATA.width = 10;
        ellipseSelectionDraw['config'].SELECTION_DATA.height = 10;
        const ctx = ellipseSelectionDraw['config'].SELECTION_DATA.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = Colors.BLACK.rgbString;
        ctx.fillRect(0, 0, 10, 10);
    });

    it('should fillbacground with white', () => {
        ellipseSelectionDraw['fillBackground'](ctxStub);
        let imageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(ellipseSelectionDraw['config'].width / 2, ellipseSelectionDraw['config'].height / 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.R);
        expect(imageData.data[1]).toEqual(Colors.WHITE.G);
        expect(imageData.data[2]).toEqual(Colors.WHITE.B);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should not fill the background if the selection has not moved', () => {
        const fillSpy = spyOn(ctxStub, 'fill');
        ellipseSelectionDraw['config'].startCoords = new Vec2(0, 0);
        ellipseSelectionDraw['config'].endCoords = new Vec2(0, 0);
        ellipseSelectionDraw['fillBackground'](ctxStub);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('should not fill the background if the selection is marked to be pasted', () => {
        const fillSpy = spyOn<any>(ellipseSelectionDraw, 'fillBackground');
        ellipseSelectionDraw['config'].markedForPaste = true;
        ellipseSelectionDraw['config'].markedForDelete = true;
        ellipseSelectionDraw.execute(ctxStub);
        expect(fillSpy).not.toHaveBeenCalled();
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
        expect(imageData.data[0]).toEqual(Colors.WHITE.R);
        expect(imageData.data[1]).toEqual(Colors.WHITE.R);
        expect(imageData.data[2]).toEqual(Colors.WHITE.R);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should make appropriate calls on execute', () => {
        spyOn<any>(ellipseSelectionDraw, 'fillBackground').and.callThrough();
        ellipseSelectionDraw.execute(ctxStub);
        expect(ellipseSelectionDraw['fillBackground']).toHaveBeenCalled();
    });
});
