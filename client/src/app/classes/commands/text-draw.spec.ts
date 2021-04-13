import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { TextDraw } from './text-draw';

// tslint:disable:no-string-literal

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
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'applyAttributes').and.callThrough();
        textDraw.execute(ctxStub);
        textDraw.config.italic = true;
        textDraw.config.alignmentSetting = 'left';
        textDraw.execute(ctxStub);
        textDraw.config.bold = true;
        textDraw.config.alignmentSetting = 'right';
        textDraw.execute(ctxStub);
        textDraw.config.italic = false;
        textDraw.execute(ctxStub);
        expect(textDraw['applyAttributes']).toHaveBeenCalled();
    });

    it('should call drawText in applyAttributes', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'drawText').and.callThrough();
        textDraw['applyAttributes'](ctxStub);
        expect(textDraw['drawText']).toHaveBeenCalled();
    });

    it('should call drawCursor in drawText when hasInput is true', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'drawCursor');
        textDraw.config.hasInput = true;

        textDraw['drawText'](ctxStub);
        expect(textDraw['drawCursor']).toHaveBeenCalled();
    });

    it('should call by default drawCursorLeft', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'drawCursorLeft').and.callThrough();

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorLeft']).toHaveBeenCalled();
    });

    it('should call by drawCursorRight when textAlign is right', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'drawCursorRight').and.callThrough();
        textDraw.config.alignmentSetting = 'right';

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorRight']).toHaveBeenCalled();
    });

    it('should call by drawCursorCenter when textAlign is center', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'drawCursorCenter').and.callThrough();
        textDraw.config.alignmentSetting = 'center';

        textDraw['drawCursor'](ctxStub);
        expect(textDraw['drawCursorCenter']).toHaveBeenCalled();
    });

    it('should call alignLeft when textAlign is set to left', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'alignLeft').and.callThrough();
        textDraw.config.alignmentSetting = 'left';
        textDraw.config.newAlignment = true;

        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignLeft']).toHaveBeenCalled();

        textDraw.config.lastAlignment = 'center';
        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignLeft']).toHaveBeenCalled();
    });

    it('should call alignRight when textAlign is set to right', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'alignRight').and.callThrough();
        textDraw.config.alignmentSetting = 'right';
        textDraw.config.newAlignment = true;

        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignRight']).toHaveBeenCalled();

        textDraw.config.lastAlignment = 'center';
        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignRight']).toHaveBeenCalled();
    });

    it('should call alignCenter when textAlign is set to center', () => {
        // tslint:disable-next-line:no-any
        spyOn<any>(textDraw, 'alignCenter').and.callThrough();
        textDraw.config.alignmentSetting = 'center';
        textDraw.config.newAlignment = true;
        textDraw.config.lastAlignment = 'left';

        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignCenter']).toHaveBeenCalled();

        textDraw.config.newAlignment = true;
        textDraw.config.lastAlignment = 'right';
        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignCenter']).toHaveBeenCalled();
        textDraw['handleAlign'](ctxStub);
        expect(textDraw['alignCenter']).toHaveBeenCalled();
    });
});
