import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { LineConfig } from '@app/classes/tool-config/line-config.ts';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';
import { HexColors } from 'src/color-picker/constants/hex-colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { LineDraw } from './line-draw';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('LineDraw', () => {
    let lineDraw: LineDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.BLACK.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        lineDraw = new LineDraw(colorService, new LineConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should construct properly', () => {
        expect(lineDraw).toBeDefined();
        expect(lineDraw['primaryRgba']).toEqual(Colors.BLACK.rgbString);
        expect(lineDraw['secondaryRgba']).toEqual(Colors.BLUE.rgbString);
        expect(lineDraw['config'].showJunctionPoints).toBeTrue();
        expect(lineDraw['config'].points).toEqual([]);
        expect(lineDraw['config'].closedLoop).toBeFalse();
        expect(lineDraw['config'].thickness).toEqual(ToolSettingsConst.DEFAULT_LINE_WIDTH);
        expect(lineDraw['config'].diameterJunctions).toEqual(ToolSettingsConst.DEFAULT_LINE_JUNCTION_WIDTH);
    });

    it('should make proper calls on execute', () => {
        spyOn<any>(lineDraw, 'applyAttributes').and.stub();
        spyOn<any>(lineDraw, 'drawLinePath').and.stub();
        lineDraw.execute(ctxStub);
        expect(lineDraw['applyAttributes']).toHaveBeenCalledWith(ctxStub);
        expect(lineDraw['drawLinePath']).toHaveBeenCalledWith(ctxStub);
    });

    it('should apply attributes to context properly', () => {
        const hexBlack = '#' + HexColors.BLACK;
        lineDraw['applyAttributes'](ctxStub);
        expect(ctxStub.fillStyle).toEqual(hexBlack);
        expect(ctxStub.strokeStyle).toEqual(hexBlack);
        expect(ctxStub.lineWidth).toEqual(lineDraw['config'].thickness);
    });

    it('should not draw junction if disabled', () => {
        const point: Vec2 = new Vec2(1, 1);
        lineDraw['config'].showJunctionPoints = false;
        lineDraw['drawJunction'](ctxStub, point);

        // Canvas should all be 0 as nothing is drawn
        const imageData: ImageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should draw junction if enabled', () => {
        const point: Vec2 = new Vec2(1, 1);
        lineDraw['config'].showJunctionPoints = true;
        lineDraw['drawJunction'](ctxStub, point);

        // Canvas should be black at that position
        const imageData: ImageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should attempt to draw junction on line draw', () => {
        const points: Vec2[] = [new Vec2(0, 0), new Vec2(2, 2)];
        lineDraw['config'].points = points;
        spyOn<any>(lineDraw, 'drawJunction').and.stub();
        lineDraw['drawLinePath'](ctxStub);
        expect(lineDraw['drawJunction']).toHaveBeenCalled();
    });

    it('should draw line between point', () => {
        const points: Vec2[] = [new Vec2(0, 0), new Vec2(2, 2), new Vec2(1, 2), new Vec2(0, 1)];
        lineDraw['config'].points = points;
        lineDraw['config'].showJunctionPoints = false;
        lineDraw['config'].closedLoop = true;
        lineDraw['drawLinePath'](ctxStub);

        const imageData: ImageData = ctxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
