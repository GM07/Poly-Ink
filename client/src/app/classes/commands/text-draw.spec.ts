import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { TextDraw } from './text-draw';

// tslint:disable:no-string-literal
// To access private methods in expect

describe('TextDraw', () => {
    let textDraw: TextDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        colorService = { primaryColor: Colors.BLACK, secondaryColor: Colors.BLUE, primaryColorAlpha: 1.0, secondaryColorAlpha: 1.0 } as ColorService;
        textDraw = new TextDraw(colorService, new TextConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should call applyAttributes on execute', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'applyAttributes').and.callThrough();
        textDraw.execute(ctxStub);
        textDraw.config.italic = true;
        textDraw.config.alignmentSetting = 'center';
        textDraw.execute(ctxStub);
        textDraw.config.bold = true;
        textDraw.config.alignmentSetting = 'right';
        textDraw.execute(ctxStub);
        textDraw.config.italic = false;
        textDraw.execute(ctxStub);
        expect(textDraw['applyAttributes']).toHaveBeenCalled();
    });

    it('should call drawText in applyAttributes', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'drawText').and.callThrough();
        textDraw['applyAttributes'](ctxStub);
        expect(textDraw['drawText']).toHaveBeenCalled();
    });

    it('should call drawCursor in drawText when hasInput is true', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'drawCursor');
        textDraw.config.hasInput = true;

        textDraw['drawText'](ctxStub);
        expect(textDraw['drawCursor']).toHaveBeenCalled();
    });

    it('should call by default drawCursorLeft', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'drawCursorLeft').and.callThrough();

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorLeft']).toHaveBeenCalled();
    });

    it('should call by drawCursorRight when textAlign is right', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'drawCursorRight').and.callThrough();
        textDraw.config.alignmentSetting = 'right';

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorRight']).toHaveBeenCalled();
    });

    it('should call by drawCursorCenter when textAlign is center', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(textDraw, 'drawCursorCenter').and.callThrough();
        textDraw.config.alignmentSetting = 'center';

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorCenter']).toHaveBeenCalled();
    });
});
