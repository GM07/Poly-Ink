import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDraw } from './resize-draw';

// tslint:disable:no-string-literal

describe('ResizeDraw', () => {
    let resizeDraw: ResizeDraw;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable:no-string-literal
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['resizeCanvas']);
        resizeDraw = new ResizeDraw(new ResizeConfig(), drawServiceSpy);

        resizeDraw['config'].height = 0;
        resizeDraw['config'].width = 0;
    });

    it('should call resize on execute', () => {
        resizeDraw.execute();
        expect(drawServiceSpy.resizeCanvas).toHaveBeenCalledWith(0, 0);
    });
});
