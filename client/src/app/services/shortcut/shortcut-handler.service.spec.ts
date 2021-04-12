import { TestBed } from '@angular/core/testing';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ColorService } from 'src/color-picker/services/color.service';
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

    it('should transfer the MouseClick event to the tool Handler if the shortcuts are not blocked', () => {
      service.blockShortcuts = false;
      spyOn(toolHandlerService, 'onMouseClick').and.callThrough();
      service.onMouseClick(mouseEvent);
      expect(toolHandlerService.onMouseClick).toHaveBeenCalled();
  });

  it('should not transfer the MouseClick event to the tool Handler if the shortcuts are blocked', () => {
      service.blockShortcuts = true;
      spyOn(toolHandlerService, 'onMouseClick').and.callThrough();
      service.onMouseClick(mouseEvent);
      expect(toolHandlerService.onMouseClick).not.toHaveBeenCalled();
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
});
