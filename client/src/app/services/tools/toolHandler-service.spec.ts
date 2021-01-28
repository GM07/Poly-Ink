import { TestBed } from '@angular/core/testing';
import { PencilService } from './pencil-service';
import { ToolHandlerService } from './toolHandler-service';

// tslint:disable:no-any
describe('ToolHandlerService', () => {
    let service: ToolHandlerService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;

    let pencilService: PencilService;
    //let pencilServiceSpy: jasmine.SpyObj<PencilService>;

    beforeEach(() => {
        //pencilServiceSpy = spyOnAllFunctions<any>(PencilService);

        TestBed.configureTestingModule({
            //providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        });
        //TestBed.inject(DrawingService);
        pencilService = TestBed.inject(PencilService);
        modifyObjectToSpyOnAllFunctions(pencilService);
        service = TestBed.inject(ToolHandlerService);
        //pencilServiceSpy = spyOnAllFunctions(PencilService.prototype);

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
        //console.info(pencilServiceSpy);
        //modifyObjectToSpyOnAllFunctions(pencilService);
        //spyOn<any>(pencilService, 'onMouseMove');

        //let drawServiceSpy = jasmine.createSpyObj('PencilService', ['onMouseMove']);
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

    function modifyObjectToSpyOnAllFunctions(object: any) {
        do {
            Object.getOwnPropertyNames(object).filter((p: string) => {
                if (typeof object[p] == 'function') {
                    spyOn<any>(object, p);
                }
            });
        } while ((object = Object.getPrototypeOf(object)) && object != Object.prototype);
    }
});
