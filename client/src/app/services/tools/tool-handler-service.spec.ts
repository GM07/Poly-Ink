import { TestBed } from '@angular/core/testing';
import { PencilService } from './pencil-service';
import { ToolHandlerService } from './tool-handler-service';

// tslint:disable:no-any
describe('ToolHandlerService', () => {
    let service: ToolHandlerService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;

    let pencilService: PencilService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        pencilService = TestBed.inject(PencilService);
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
        service.onKeyPress(keyboardEvent);
        expect(service.getTool()).toBeInstanceOf(PencilService);
        keyboardEvent = { key: 'FakeKey' } as KeyboardEvent;
        service.onKeyPress(keyboardEvent);
        expect(service.getTool()).toBeInstanceOf(PencilService);
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
