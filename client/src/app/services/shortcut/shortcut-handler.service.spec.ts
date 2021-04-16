import { TestBed } from '@angular/core/testing';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ShortcutHandlerService } from './shortcut-handler.service';

// tslint:disable:no-string-literal
class ToolStub extends Tool {
    shortcutKey: ShortcutKey = new ShortcutKey('stub');
    stopDrawing(): void {
        /**/
    }
}

describe('ShortcutHandlerService', () => {
    let toolHandlerService: ToolHandlerService;
    let textService: TextService;
    let service: ShortcutHandlerService;
    let keyboardEvent: KeyboardEvent;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        toolHandlerService = TestBed.inject(ToolHandlerService);
        textService = TestBed.inject(TextService);
        service = TestBed.inject(ShortcutHandlerService);
        const undoRedo = TestBed.inject(UndoRedoService);
        spyOn(undoRedo, 'onKeyDown');
        keyboardEvent = new KeyboardEvent('document:keydown', {});
        mouseEvent = {} as MouseEvent;
        const toolStub = new ToolStub({} as DrawingService, {} as ColorService);
        toolHandlerService['currentTool'] = toolStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transfer the keyDown event to the tool Handler if the shortcuts are not blocked', () => {
        spyOn(textService, 'onKeyDown');
        toolHandlerService.setTool(TextToolConstants.TOOL_ID);
        service.onKeyDown(keyboardEvent);

        service.blockShortcuts = false;
        spyOn(toolHandlerService, 'onKeyDown').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(toolHandlerService.onKeyDown).toHaveBeenCalled();
    });

    it('should transfer the MouseMove event to the tool Handler if the shortcuts are not blocked', () => {
        service.blockShortcuts = false;
        spyOn(toolHandlerService, 'onMouseMove').and.callThrough();
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
        spyOn(toolHandlerService, 'onMouseMove').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(toolHandlerService.onMouseMove).not.toHaveBeenCalled();
    });

    it('should transfer the onDocumentMouseDown event to the tool Handler if the shortcuts are not blocked', () => {
        service.blockShortcuts = false;
        spyOn(toolHandlerService, 'onDocumentMouseDown').and.callThrough();
        service.onDocumentMouseDown(mouseEvent);
        expect(toolHandlerService.onDocumentMouseDown).toHaveBeenCalled();
    });

    it('should not transfer the onDocumentMouseDown event to the tool Handler if the shortcuts are blocked', () => {
        service.blockShortcuts = true;
        spyOn(toolHandlerService, 'onDocumentMouseDown').and.callThrough();
        service.onDocumentMouseDown(mouseEvent);
        expect(toolHandlerService.onDocumentMouseDown).not.toHaveBeenCalled();
    });

    it('should return the blocked shortcut status', () => {
        service['blockShortcutsIn'] = true;
        expect(service.blockShortcuts).toBeTruthy();
    });

    it('should simulate a mouseUp event when the shortcuts are blocked', () => {
        const onMouseUpSpy = spyOn(toolHandlerService, 'onMouseUp');
        service['lastMouseMoveEvent'] = {} as MouseEvent;
        service.blockShortcuts = false;
        expect(onMouseUpSpy).not.toHaveBeenCalled();
        service.blockShortcuts = true;
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('should init subscriptions', () => {
        const subscribeSpy = spyOn(textService.BLOCK_SHORTCUTS, 'subscribe').and.callThrough();
        service['initSubscriptions']();
        expect(subscribeSpy).toHaveBeenCalled();

        textService.BLOCK_SHORTCUTS.next(true);
        expect(service['blockShortcuts']).toBeTruthy();
    });

    it('should indicate if the user is locked to the current tool', () => {
        spyOn(toolHandlerService, 'getCurrentTool').and.returnValue(textService);
        textService.config.hasInput = true;
        expect(service['isLockedToTool']()).toBeTruthy();
    });

    it('should call the current tool onKeyDown if whiteListed', () => {
        const onKeyDownSpy = spyOn(service['toolHandlerService'].getCurrentTool(), 'onKeyDown');
        service['blockShortcutsIn'] = true;
        service['isWhiteListed'] = true;
        service.onKeyDown(keyboardEvent);
        expect(onKeyDownSpy).toHaveBeenCalled();
    });
});
