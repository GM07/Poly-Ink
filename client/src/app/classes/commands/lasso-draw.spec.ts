import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { LineDrawer } from '@app/classes/line-drawer';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { LassoDraw } from './lasso-draw';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
/* tslint:disable:no-empty */

describe('LassoDraw', () => {
    let lassoDraw: LassoDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        lassoDraw = new LassoDraw(colorService, new LassoConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        lassoDraw['config'].startCoords = new Vec2(0, 0);
        lassoDraw['config'].endCoords = new Vec2(15, 15);
        lassoDraw['config'].height = 10;
        lassoDraw['config'].originalHeight = 10;
        lassoDraw['config'].width = 10;
        lassoDraw['config'].originalWidth = 10;
        lassoDraw['config'].points = [new Vec2(2, 2), new Vec2(2, 10), new Vec2(10, 10), new Vec2(10, 2)];
        lassoDraw['config'].originalPoints = [new Vec2(2, 2), new Vec2(2, 10), new Vec2(10, 10), new Vec2(10, 2)];

        ctxStub.canvas.width = 100;
        ctxStub.canvas.height = 100;
        ctxStub.fillStyle = Colors.BLACK.rgbString;
        ctxStub.fillRect(0, 0, 10, 10);
    });

    it('should fillbackground with white', () => {
        lassoDraw['fillBackground'](ctxStub);
        let imageData = ctxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[ALPHA]).not.toEqual(0);

        imageData = ctxStub.getImageData(lassoDraw['config'].width / 2, lassoDraw['config'].height / 2, 1, 1);
        expect(imageData.data[0]).toEqual(Colors.WHITE.r);
        expect(imageData.data[1]).toEqual(Colors.WHITE.g);
        expect(imageData.data[2]).toEqual(Colors.WHITE.b);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });

    it('should not fill the background if the selection has not moved', () => {
        const fillSpy = spyOn(ctxStub, 'fill');
        lassoDraw['config'].isInSelection = true;
        lassoDraw['config'].startCoords = new Vec2(0, 0);
        lassoDraw['config'].endCoords = new Vec2(0, 0);
        lassoDraw['fillBackground'](ctxStub);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('should not fill the background if the selection is marked to be pasted', () => {
        const fillSpy = spyOn<any>(lassoDraw, 'fillBackground');
        lassoDraw['config'].isInSelection = true;
        lassoDraw['config'].markedForPaste = true;
        lassoDraw['config'].markedForDelete = true;
        lassoDraw.execute(ctxStub);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('should not fill basckground if did not change', () => {
        spyOn(lassoDraw['config'], 'didChange').and.returnValue(false);
        spyOn(LineDrawer, 'drawFilledLinePath').and.callThrough();
        lassoDraw['fillBackground'](ctxStub);
        expect(LineDrawer['drawFilledLinePath']).not.toHaveBeenCalled();
    });

    it('should draw dashed line path with red white if intersecting', () => {
        lassoDraw['config'].intersecting = true;
        const spy = spyOn(LineDrawer, 'drawDashedLinePath');
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['red', 'white']);
    });

    it('should draw dashed line path with red white if intersecting', () => {
        lassoDraw['config'].intersecting = true;
        const spy = spyOn(LineDrawer, 'drawDashedLinePath');
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['red', 'white']);
    });

    it('should draw dashed line path with black white if intersecting', () => {
        const spy = spyOn(LineDrawer, 'drawDashedLinePath');
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['black', 'white']);
    });

    it('should draw dashed clipped path in selection', () => {
        lassoDraw['config'].isInSelection = true;
        const spy = spyOn<any>(lassoDraw, 'fillBackground');
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalled();
    });
});
