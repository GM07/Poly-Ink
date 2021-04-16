import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { BucketConfig } from '@app/classes/tool-config/bucket-config';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { BucketDraw } from './bucket-draw';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('BucketDraw', () => {
    let bucketDraw: BucketDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const R = 0;
    const G = 1;
    const B = 2;

    beforeEach(() => {
        colorService = { primaryColor: Colors.RED, secondaryColor: Colors.BLUE, primaryColorAlpha: 1.0, secondaryColorAlpha: 1.0 } as ColorService;
        bucketDraw = new BucketDraw(colorService, new BucketConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        bucketDraw['pixels'] = new ImageData(new Uint8ClampedArray([0, 0, 0, 1]), 1, 1);
        bucketDraw['originalPixel'] = new Uint8ClampedArray([0, 0, 0, 1]);
        bucketDraw['config'].point = new Vec2(1, 1);
        bucketDraw['visited'] = new Set();
        bucketDraw['queue'] = [];
    });

    const splitCanvasWithLine = () => {
        // Creating a line spliting the canvas in two parts
        ctxStub.lineWidth = 1;
        ctxStub.fillStyle = Colors.WHITE.rgbString;
        ctxStub.strokeStyle = Colors.WHITE.rgbString;
        ctxStub.beginPath();
        ctxStub.moveTo(ctxStub.canvas.width / 2, 0);
        ctxStub.lineTo(ctxStub.canvas.width / 2, ctxStub.canvas.height);
        ctxStub.stroke();
        ctxStub.closePath();
    };

    it('should do appropriate calls on execute with contiguous pixels', () => {
        spyOn(ctxStub, 'putImageData').and.stub();
        spyOn<any>(bucketDraw, 'saveOriginalPixel').and.stub();
        spyOn<any>(bucketDraw, 'floodFill').and.stub();
        spyOn<any>(bucketDraw, 'pixelFill').and.stub();
        spyOn<any>(bucketDraw, 'getPixels').and.callThrough();

        bucketDraw['config'].contiguous = true;
        bucketDraw.execute(ctxStub);

        expect(ctxStub.putImageData).toHaveBeenCalled();
        expect(bucketDraw['getPixels']).toHaveBeenCalled();
        expect(bucketDraw['saveOriginalPixel']).toHaveBeenCalled();
        expect(bucketDraw['floodFill']).toHaveBeenCalled();
        expect(bucketDraw['pixelFill']).not.toHaveBeenCalled();
    });

    it('should do appropriate calls on execute with non contiguous pixels', () => {
        spyOn(ctxStub, 'putImageData').and.stub();
        spyOn<any>(bucketDraw, 'saveOriginalPixel').and.stub();
        spyOn<any>(bucketDraw, 'floodFill').and.stub();
        spyOn<any>(bucketDraw, 'pixelFill').and.stub();
        spyOn<any>(bucketDraw, 'getPixels').and.callThrough();

        bucketDraw['config'].contiguous = false;
        bucketDraw.execute(ctxStub);

        expect(ctxStub.putImageData).toHaveBeenCalled();
        expect(bucketDraw['getPixels']).toHaveBeenCalled();
        expect(bucketDraw['saveOriginalPixel']).toHaveBeenCalled();
        expect(bucketDraw['floodFill']).not.toHaveBeenCalled();
        expect(bucketDraw['pixelFill']).toHaveBeenCalled();
    });

    it('should flood fill appropriately left of line', () => {
        splitCanvasWithLine();
        bucketDraw['config'].contiguous = true;
        bucketDraw['config'].tolerance = 0;
        bucketDraw.execute(ctxStub);

        const pixelLeftOfLine = ctxStub.getImageData(0, 0, 1, 1);
        expect(pixelLeftOfLine.data[R]).toEqual(Colors.RED.r);
        expect(pixelLeftOfLine.data[G]).toEqual(Colors.RED.g);
        expect(pixelLeftOfLine.data[B]).toEqual(Colors.RED.b);

        const pixelRightOfLine = ctxStub.getImageData(ctxStub.canvas.width - 1, 0, 1, 1);
        expect(pixelRightOfLine.data[R]).toEqual(Colors.BLACK.r);
        expect(pixelRightOfLine.data[G]).toEqual(Colors.BLACK.g);
        expect(pixelRightOfLine.data[B]).toEqual(Colors.BLACK.b);
    });

    it('should flood fill appropriately right of line', () => {
        splitCanvasWithLine();
        bucketDraw['config'].contiguous = true;
        bucketDraw['config'].tolerance = 0;
        bucketDraw['config'].point = new Vec2(ctxStub.canvas.width - 1, 1);
        bucketDraw.execute(ctxStub);

        const pixelLeftOfLine = ctxStub.getImageData(0, 0, 1, 1);
        expect(pixelLeftOfLine.data[R]).toEqual(Colors.BLACK.r);
        expect(pixelLeftOfLine.data[G]).toEqual(Colors.BLACK.g);
        expect(pixelLeftOfLine.data[B]).toEqual(Colors.BLACK.b);

        const pixelRightOfLine = ctxStub.getImageData(ctxStub.canvas.width - 1, 0, 1, 1);
        expect(pixelRightOfLine.data[R]).toEqual(Colors.RED.r);
        expect(pixelRightOfLine.data[G]).toEqual(Colors.RED.g);
        expect(pixelRightOfLine.data[B]).toEqual(Colors.RED.b);
    });

    it('should pixel fill approprietly', () => {
        splitCanvasWithLine();
        bucketDraw['config'].contiguous = false;
        bucketDraw['config'].tolerance = 0;
        bucketDraw.execute(ctxStub);

        const pixelLeftOfLine = ctxStub.getImageData(0, 0, 1, 1);
        expect(pixelLeftOfLine.data[R]).toEqual(Colors.RED.r);
        expect(pixelLeftOfLine.data[G]).toEqual(Colors.RED.g);
        expect(pixelLeftOfLine.data[B]).toEqual(Colors.RED.b);

        const pixelRightOfLine = ctxStub.getImageData(0, 0, 1, 1);
        expect(pixelRightOfLine.data[R]).toEqual(Colors.RED.r);
        expect(pixelRightOfLine.data[G]).toEqual(Colors.RED.g);
        expect(pixelRightOfLine.data[B]).toEqual(Colors.RED.b);
    });

    it('should add adjacent only if inside canvas', () => {
        spyOn(bucketDraw['queue'], 'push').and.stub();
        spyOn(bucketDraw['visited'], 'add').and.stub();

        const invalidPos = -1;
        bucketDraw['addAdjacent'](invalidPos);

        expect(bucketDraw['queue'].push).not.toHaveBeenCalled();
        expect(bucketDraw['visited'].add).not.toHaveBeenCalled();

        bucketDraw['addAdjacent'](bucketDraw['pixels'].data.length + 1);

        expect(bucketDraw['queue'].push).not.toHaveBeenCalled();
        expect(bucketDraw['visited'].add).not.toHaveBeenCalled();
    });

    it('should only add points once', () => {
        spyOn(bucketDraw['queue'], 'push').and.stub();
        spyOn(bucketDraw['visited'], 'add').and.callThrough();

        bucketDraw['addAdjacent'](0);
        bucketDraw['addAdjacent'](0);

        expect(bucketDraw['queue'].push).toHaveBeenCalledTimes(1);
        expect(bucketDraw['visited'].add).toHaveBeenCalledTimes(1);
    });

    it('shouldFill returns true if pixel is the same as the original one', () => {
        bucketDraw['config'].tolerance = 0;
        expect(bucketDraw['shouldFill'](0)).toBeTruthy();
    });

    it('shouldFill returns false if pixel is not within tolerance of the original one', () => {
        const tolerance = 49;
        bucketDraw['pixels'] = new ImageData(new Uint8ClampedArray([127, 127, 127, 1]), 1, 1);
        bucketDraw['config'].tolerance = tolerance;
        expect(bucketDraw['shouldFill'](0)).toBeFalsy();
    });

    it('shouldFill returns true if pixel is within tolerance of the original one', () => {
        const tolerance = 50;
        bucketDraw['pixels'] = new ImageData(new Uint8ClampedArray([127, 127, 127, 1]), 1, 1);
        bucketDraw['config'].tolerance = tolerance;
        expect(bucketDraw['shouldFill'](0)).toBeTruthy();
    });

    it('should set pixel properly if alhpa is 1', () => {
        bucketDraw['setPixel'](0);
        const newPixels = bucketDraw['pixels'].data.subarray(0, 4);

        expect(newPixels[R]).toEqual(Colors.RED.r);
        expect(newPixels[G]).toEqual(Colors.RED.g);
        expect(newPixels[B]).toEqual(Colors.RED.b);
    });

    it('should set pixel properly if alpha is not 1', () => {
        // We expect the output to be a blend of the primary color (Red) and gray
        bucketDraw['pixels'] = new ImageData(new Uint8ClampedArray([127, 127, 127, 1]), 1, 1);
        bucketDraw['primaryAlpha'] = 0.5;
        bucketDraw['setPixel'](0);
        const newPixels = bucketDraw['pixels'].data.subarray(0, 4);

        expect(newPixels[R]).not.toEqual(Colors.RED.r);
        expect(newPixels[G]).not.toEqual(Colors.RED.g);
        expect(newPixels[B]).not.toEqual(Colors.RED.b);
    });

    it('should duplicate original pixel to prevent it from changing', () => {
        bucketDraw['saveOriginalPixel'](ctxStub);

        const originalPixel = bucketDraw['originalPixel'];
        const pixels = bucketDraw['pixels'].data;

        // Changing the values of the pixels should not change the original pixel
        pixels.set([1, 1, 1, 1], 0);

        expect(originalPixel).not.toEqual(pixels);
    });
});
