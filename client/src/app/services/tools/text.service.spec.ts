import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from './text.service';

// tslint:disable:no-string-literal
// To access private methods in expect

describe('TextService', () => {
    let service: TextService;
    let drawingService: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextService);
        drawingService = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should handleShortCuts when shortcutkey down', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault'], { key: 'Delete' });
        spyOn(service, 'drawPreview');

        service.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(service.drawPreview).toHaveBeenCalled();
    });

    it('should prevent default when space bar key is down', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault'], { key: ' ' });
        spyOn(service, 'drawPreview');

        service.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(service.drawPreview).toHaveBeenCalled();
    });

    it('should insert when the key down is not a shortcut and only if hasInput is true', () => {
        const event = jasmine.createSpyObj('event', [], { key: 'a' });
        spyOn(service, 'insert');
        spyOn(service, 'drawPreview');
        service.onKeyDown(event);

        service.config.hasInput = true;
        service.onKeyDown(event);
        expect(service.insert).toHaveBeenCalledTimes(1);
        expect(service.drawPreview).toHaveBeenCalled();
    });

    it('should handle ignored shortcuts', () => {
        const event = jasmine.createSpyObj('event', [], { key: 'Meta' });
        service.insert(event);
        expect(service.config.index.x).toEqual(0);
        expect(service.config.index.y).toEqual(0);
    });

    it('should handle enter key', () => {
        const event = jasmine.createSpyObj('event', [], { key: 'Enter' });
        service.insert(event);
        expect(service.config.index.x).toEqual(0);
        expect(service.config.index.y).toEqual(1);
    });

    it('should handle a character insert', () => {
        const event = jasmine.createSpyObj('event', [], { key: 'a' });
        service.insert(event);
        expect(service.config.index.x).toEqual(1);
        expect(service.config.index.y).toEqual(0);
    });

    it('should modify config attributes after drawing text on baseCanvas', () => {
        spyOn(service, 'draw');
        service.confirmText();
        expect(service.config.hasInput).toBeFalse();
        expect(service.config.index.x).toBe(0);
        expect(service.config.index.y).toBe(0);
        expect(service.config.textData).toEqual(['']);
    });

    it('should handle delete', () => {
        const indexX = 3;
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleDelete').and.callThrough();
        service.config.index.x = 0;
        service.config.index.y = 1;
        service.config.textData[1] = '';
        service['handleShortCuts'](TextService['delete']);
        expect(service.config.index.y).toEqual(0);

        service.config.index.y = 0;
        service.config.textData[0] = 'allo!';

        service['handleShortCuts'](TextService['delete']);
        expect(service['handleDelete']).toHaveBeenCalled();

        service.config.index.x = indexX;
        service.config.textData[0] = 'a';
        service['handleShortCuts'](TextService['delete']);
        expect(service['handleDelete']).toHaveBeenCalled();
    });

    it('should handle backSpace', () => {
        const indexX = 3;
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleBackspace').and.callThrough();
        service['handleShortCuts'](TextService['backspace']);
        expect(service['handleBackspace']).toHaveBeenCalled();

        service.config.index.y = 1;
        service.config.index.x = 0;
        service.config.textData[0] = 'a';
        service['handleShortCuts'](TextService['backspace']);
        expect(service['handleBackspace']).toHaveBeenCalled();

        service.config.index.x = indexX;
        service.config.index.y = 0;
        service.config.textData[0] = 'aaaaa';
        service['handleShortCuts'](TextService['backspace']);
        expect(service['handleBackspace']).toHaveBeenCalled();
    });

    it('should handle escape', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleEscape').and.callThrough();
        spyOn(drawingService, 'clearCanvas');
        spyOn(drawingService, 'unblockUndoRedo');
        service['handleShortCuts'](TextService['escape']);
        expect(service['handleEscape']).toHaveBeenCalled();
    });

    it('should handle ArrowLeft', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleArrowLeft').and.callThrough();
        service['handleShortCuts'](TextService['arrowLeft']);
        expect(service['handleArrowLeft']).toHaveBeenCalled();

        service.config.index.x = 1;
        service['handleShortCuts'](TextService['arrowLeft']);
        expect(service['handleArrowLeft']).toHaveBeenCalled();

        service.config.index.y = 1;
        service.config.index.x = 0;
        service.config.textData[0] = 'a';
        service['handleShortCuts'](TextService['arrowLeft']);
        expect(service['handleArrowLeft']).toHaveBeenCalled();
    });

    it('should handle ArrowRight', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleArrowRight').and.callThrough();
        service['handleShortCuts'](TextService['arrowRight']);
        expect(service['handleArrowRight']).toHaveBeenCalled();

        service.config.index.y = 0;
        service.config.textData = ['aa', 'a'];
        service.config.index.x = 0;
        service['handleShortCuts'](TextService['arrowRight']);
        expect(service['handleArrowRight']).toHaveBeenCalled();

        service.config.index.y = 0;
        service.config.textData = ['aa', 'a'];
        service.config.index.x = 2;
        service['handleShortCuts'](TextService['arrowRight']);
        expect(service['handleArrowRight']).toHaveBeenCalled();
    });

    it('should handle ArrowUp', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleArrowUp').and.callThrough();
        service['handleShortCuts'](TextService['arrowUp']);
        expect(service['handleArrowUp']).toHaveBeenCalled();

        service.config.index.y = 1;
        service.config.textData[1] = 'a';
        service['handleShortCuts'](TextService['arrowUp']);
        expect(service['handleArrowUp']).toHaveBeenCalled();
    });

    it('should handle ArrowDown', () => {
        // To spy on private method with any
        // tslint:disable-next-line
        spyOn<any>(service, 'handleArrowDown').and.callThrough();
        service['handleShortCuts'](TextService['arrowDown']);
        expect(service['handleArrowDown']).toHaveBeenCalled();

        service.config.index.y = 0;
        service.config.textData = ['a', 'a'];
        service['handleShortCuts'](TextService['arrowDown']);
        expect(service['handleArrowDown']).toHaveBeenCalled();
    });

    it('should call drawPreview from drawingService', () => {
        spyOn(drawingService, 'drawPreview');
        service.drawPreview();
        expect(drawingService.drawPreview).toHaveBeenCalled();
    });

    it('should call draw from drawingService', () => {
        spyOn(drawingService, 'clearCanvas');
        spyOn(drawingService, 'draw');
        service.draw();
        expect(drawingService.draw).toHaveBeenCalled();
    });

    it('should confirm text when stop drawing is called', () => {
        spyOn(service, 'confirmText');
        service.stopDrawing();
        expect(service.confirmText).toHaveBeenCalled();
    });

    it('should handle delete', () => {
        service.config.index.x = 0;
        service.config.index.y = 0;
        service.config.textData[0] = 'aa';
        service['handleDelete']();
        expect(service.config.textData[0]).toBe('a');
    });

    it('should handle backspace', () => {
        service.config.index.x = 1;
        service.config.index.y = 0;
        service.config.textData[0] = 'aa';
        service['handleBackspace']();
        expect(service.config.textData[0]).toBe('a');
    });

    it('should handle escape', () => {
        spyOn(drawingService, 'clearCanvas');
        spyOn(drawingService, 'unblockUndoRedo');
        service.config.textData[0] = 'aa';
        service['handleEscape']();
        expect(service.config.textData).toEqual(['']);
    });

    it('should handle arrow left', () => {
        service.config.index.x = 1;
        service['handleArrowLeft']();
        expect(service.config.index.x).toBe(0);
    });

    it('should handle arrow right', () => {
        service.config.index.x = 0;
        service.config.index.y = 0;
        service.config.textData = ['a', 'b'];
        service['handleArrowRight']();
        expect(service.config.index.x).toBe(1);
    });

    it('should handle arrow up', () => {
        service.config.index.y = 1;
        service.config.textData[1] = 'a';
        service['handleArrowUp']();
        expect(service.config.index.y).toBe(0);
    });

    it('should handle arrow down', () => {
        service.config.index.y = 0;
        service.config.textData = ['a', 'b'];
        service['handleArrowDown']();
        expect(service.config.index.y).toBe(1);
    });
});