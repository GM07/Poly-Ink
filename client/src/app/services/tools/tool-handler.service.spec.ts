import { TestBed } from '@angular/core/testing';
import * as ToolsConstants from '@app/classes/tool_ui_settings/tools.constants';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { ToolHandlerService } from './tool-handler.service';
import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';

// tslint:disable:no-any
describe('ToolHandlerService', () => {
    let service: ToolHandlerService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;

    let pencilService: PencilService;
    let lineService: LineService;
    let newDrawingService : NewDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        pencilService = TestBed.inject(PencilService);
        lineService = TestBed.inject(LineService);
        newDrawingService = TestBed.inject(NewDrawingService);
        modifyObjectToSpyOnAllFunctions(pencilService);
        service = TestBed.inject(ToolHandlerService);

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transfer mouse events', () => {
        service.onMouseMove(mouseEvent);
        expect(pencilService.onMouseMove).toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        expect(pencilService.onMouseDown).toHaveBeenCalled();
        service.onMouseUp(mouseEvent);
        expect(pencilService.onMouseUp).toHaveBeenCalled();
        service.onMouseLeave(mouseEvent);
        expect(pencilService.onMouseLeave).toHaveBeenCalled();
        service.onMouseEnter(mouseEvent);
        expect(pencilService.onMouseEnter).toHaveBeenCalled();
    });

    it('should change tool on keyPress', () => {
        pencilService.onMouseDown(mouseEvent);
        service.onKeyDown(keyboardEvent);
        expect(service.getTool()).toBeInstanceOf(PencilService);
        keyboardEvent = { key: 'FakeKey' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(service.getTool()).toBeInstanceOf(PencilService);
        keyboardEvent = { key: 'l' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(service.getTool()).toBeInstanceOf(LineService);
    });

    it('should transfer keyUp event', () => {
        service.onKeyUp(keyboardEvent);
        expect(pencilService.onKeyUp).toHaveBeenCalled();
    });

    it('should allow for a tool to be set', () => {
        service.setTool(ToolsConstants.PencilToolConstants.TOOL_ID);
        expect(pencilService.stopDrawing).not.toHaveBeenCalled();
        service.setTool(ToolsConstants.LineToolConstants.TOOL_ID);
        expect(pencilService.stopDrawing).toHaveBeenCalled();
        expect(service.getTool()).toBeInstanceOf(LineService);
    });

    it('should finalise the previous drawing on a tool change', () => {
        pencilService.onMouseDown(mouseEvent);
        service.onKeyDown(keyboardEvent);
        expect(pencilService.stopDrawing).not.toHaveBeenCalled();
        keyboardEvent = { key: 'FakeKey' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(pencilService.stopDrawing).not.toHaveBeenCalled();
        keyboardEvent = { key: 'l' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(pencilService.stopDrawing).toHaveBeenCalled();
        spyOn<any>(lineService, 'stopDrawing');
        keyboardEvent = { key: 'c' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(lineService.stopDrawing).toHaveBeenCalled();
    });

    it('should not do anything if menu is open', () => {
      const func = spyOn<any>(service, 'findToolshortcutKey');
      newDrawingService.showWarning = true;
      service.onKeyDown(keyboardEvent);
      expect(func).not.toHaveBeenCalled();
    });

    const modifyObjectToSpyOnAllFunctions = (object: any): void => {
        do {
            Object.getOwnPropertyNames(object).filter((p: string) => {
                if (typeof object[p] === 'function') {
                    spyOn<any>(object, p);
                }
            });
            object = Object.getPrototypeOf(object);
        } while (object != null && object !== Object.prototype);
    };
});
