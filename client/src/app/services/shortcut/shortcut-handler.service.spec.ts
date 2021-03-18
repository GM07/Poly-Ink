import { TestBed } from '@angular/core/testing';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { ShortcutHandlerService } from './shortcut-handler.service';

describe('ShortcutHandlerService', () => {
    let toolHandlerService: ToolHandlerService;
    let service: ShortcutHandlerService;
    let keyboardEvent: KeyboardEvent;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        toolHandlerService = TestBed.inject(ToolHandlerService);
        service = TestBed.inject(ShortcutHandlerService);
        keyboardEvent = new KeyboardEvent('document:keydown', {});
        mouseEvent = {} as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transfer the keyDown event to the tool Handler if the shortcuts are not blocked', () => {
        service.blockShortcuts = false;
        spyOn(toolHandlerService, 'onKeyDown').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(toolHandlerService.onKeyDown).toHaveBeenCalled();
    });

    it('should transfer the MouseMove event to the tool Handler if the shortcuts are not blocked', () => {
        service.blockShortcuts = false;
        spyOn(toolHandlerService, 'onMouseMove');
        service.onMouseMove(mouseEvent);
        expect(toolHandlerService.onMouseMove).toHaveBeenCalled();
    });

    it('should not transfer the keyDown event to the tool Handler if the shortcuts are blocked', () => {
        service.blockShortcuts = true;
        spyOn(toolHandlerService, 'onKeyDown').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(toolHandlerService.onKeyDown).not.toHaveBeenCalled();
    });

    it('should not transfer the MouseMove event to the tool Handler if the shortcuts are blocked', () => {
        service.blockShortcuts = true;
        spyOn(toolHandlerService, 'onMouseMove');
        service.onMouseMove(mouseEvent);
        expect(toolHandlerService.onMouseMove).not.toHaveBeenCalled();
    });
});
