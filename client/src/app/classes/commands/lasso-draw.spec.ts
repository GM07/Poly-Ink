import { TestBed } from '@angular/core/testing';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { CanvasTestHelper } from '../canvas-test-helper';
import { LineDrawer } from '../line-drawer';
import { LassoConfig } from '../tool-config/lasso-config';
import { Vec2 } from '../vec2';
import { LassoDraw } from './lasso-draw';

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

        ctxStub.canvas.width = 100;
        ctxStub.canvas.height = 100;
        ctxStub.fillStyle = Colors.BLACK.rgbString;
        ctxStub.fillRect(0, 0, 10, 10);
    });

    it('should fillbacground with white', () => {
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

    it('should draw dashed line path with red white if intersecting', () => {
        lassoDraw['config'].intersecting = true;
        const spy = spyOn(LineDrawer, 'drawDashedLinePath').and.callFake(() => {});
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['red', 'white']);
    });

    it('should draw dashed line path with red white if intersecting', () => {
        lassoDraw['config'].intersecting = true;
        const spy = spyOn(LineDrawer, 'drawDashedLinePath').and.callFake(() => {});
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['red', 'white']);
    });

    it('should draw dashed line path with black white if intersecting', () => {
        const spy = spyOn(LineDrawer, 'drawDashedLinePath').and.callFake(() => {});
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(0, 0), ['black', 'white']);
    });

    it('should draw dashed clipped path in selection', () => {
        lassoDraw['config'].inSelection = true;
        const spy = spyOn(LineDrawer, 'drawClippedLinePath').and.callFake(() => {});
        lassoDraw.execute(ctxStub);
        expect(spy).toHaveBeenCalledWith(ctxStub, lassoDraw['config'].points, new Vec2(15, 15));
    });
});
