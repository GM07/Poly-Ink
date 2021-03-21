import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDraw } from './resize-draw';

// tslint:disable:no-string-literal

describe('ResizeDraw', () => {
    let resizeDraw: ResizeDraw;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    // tslint:disable:no-string-literal
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['resizeCanvas']);
        resizeDraw = new ResizeDraw(new ResizeConfig(), drawServiceSpy);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        resizeDraw['config'].height = 0;
        resizeDraw['config'].width = 0;
    });

    it('should call resize on execute', () => {
        resizeDraw.execute(ctxStub);
        expect(drawServiceSpy.resizeCanvas).toHaveBeenCalledWith(0, 0);
    });
});
