import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { AbstractSelectionService } from './abstract-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('AbstractSelectionService', () => {

    let service: AbstractSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSelection: HTMLCanvasElement;

    let mouseEvent = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
  } as MouseEvent;

    beforeEach(() => {
      drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
      TestBed.configureTestingModule({
        providers: [
          { provide: DrawingService, useValue: drawServiceSpy },
      ],
      });
        service = TestBed.inject(AbstractSelectionService);
        canvasSelection = document.createElement('canvas');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('set ArrowKeyUp should update the keys when down', () =>{
      let keyboardEventLeft = new KeyboardEvent('keydown', {key: 'arrowleft'});
      let keyboardEventRight = new KeyboardEvent('keydown', {key: 'arrowright'});
      let keyboardEventDown = new KeyboardEvent('keydown', {key: 'arrowdown'});
      let keyboardEventUp = new KeyboardEvent('keydown', {key: 'arrowup'});
      (service as any).setArrowKeyUp(keyboardEventLeft);
      (service as any).setArrowKeyUp(keyboardEventRight);
      (service as any).setArrowKeyUp(keyboardEventUp);
      (service as any).setArrowKeyUp(keyboardEventDown);
      expect((service as any).isLeftArrowDown).toBe(true);
      expect((service as any).isRightArrowDown).toBe(true);
      expect((service as any).isDownArrowDown).toBe(true);
      expect((service as any).isUpArrowDown).toBe(true);
    });

    it('set ArrowKeyUp should update the keys when not down', () =>{
      let keyboardEventLeft = new KeyboardEvent('keydown', {key: 'randomKey'});
      (service as any).setArrowKeyUp(keyboardEventLeft);
      expect((service as any).isLeftArrowDown).toBe(false);
      expect((service as any).isRightArrowDown).toBe(false);
      expect((service as any).isDownArrowDown).toBe(false);
      expect((service as any).isUpArrowDown).toBe(false);
    });

    it('set arrowKeyDown should update the keys when up', () =>{
      (service as any).isLeftArrowDown = true;
      (service as any).isRightArrowDown = true;
      (service as any).isUpArrowDown = true;
      (service as any).isDownArrowDown = true;
      let keyboardEventLeft = new KeyboardEvent('keyup', {key: 'arrowleft'});
      let keyboardEventRight = new KeyboardEvent('keyup', {key: 'arrowright'});
      let keyboardEventDown = new KeyboardEvent('keyup', {key: 'arrowdown'});
      let keyboardEventUp = new KeyboardEvent('keyup', {key: 'arrowup'});
      (service as any).setArrowKeyDown(keyboardEventLeft);
      (service as any).setArrowKeyDown(keyboardEventRight);
      (service as any).setArrowKeyDown(keyboardEventUp);
      (service as any).setArrowKeyDown(keyboardEventDown);
      expect((service as any).isLeftArrowDown).toBe(false);
      expect((service as any).isRightArrowDown).toBe(false);
      expect((service as any).isDownArrowDown).toBe(false);
      expect((service as any).isUpArrowDown).toBe(false);
    });

    it('set ArrowKeyDown should update the keys when not up', () =>{
      let keyboardEventLeft = new KeyboardEvent('keydown', {key: 'randomKey'});
      (service as any).setArrowKeyDown(keyboardEventLeft);
      expect((service as any).isLeftArrowDown).toBe(false);
      expect((service as any).isRightArrowDown).toBe(false);
      expect((service as any).isDownArrowDown).toBe(false);
      expect((service as any).isUpArrowDown).toBe(false);
    });

    it('is in selection should return true if is in selection', () => {
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      (service as any).selectionCoords = {x: 0, y: 0} as Vec2;
      (service as any).width = 50;
      (service as any).height = 50;
      spyOn(service as any, 'getPositionFromMouse').and.returnValue({x:25, y:25} as Vec2);
      spyOn(service as any, 'isInSelection').and.callThrough();
      expect(service.isInSelection(mouseEvent)).toEqual(true);
    });

    it('getXArrow should return 1 if right Arrow is down', () => {
      (service as any).isRightArrowDown = true;
      expect((service as any).getXArrow()).toEqual(1);
    });

    it('getXArrow should return -1 if left Arrow is down', () => {
      (service as any).isLeftArrowDown = true;
      expect((service as any).getXArrow()).toEqual(-1);
    });

    it('getYArrow should return 1 if down Arrow is down', () => {
      (service as any).isDownArrowDown = true;
      expect((service as any).getYArrow()).toEqual(1);
    });

    it('getYArrow should return -1 if up Arrow is down', () => {
      (service as any).isUpArrowDown = true;
      expect((service as any).getYArrow()).toEqual(-1);
    });

    it('get translation should return the current translation', () => {
      let mousePos = {x: 25, y: 25} as Vec2;
      (service as any).translationOrigin = {x: 25, y: 25} as Vec2;
      expect((service as any).getTranslation(mousePos)).toEqual({x: 0, y: 0} as Vec2);
    });

    it('on mouse down should do nothing with different click', () => {
      spyOn(service, 'getPositionFromMouse');
      const badMouseEvent = {button: 1} as MouseEvent;
      service.onMouseDown(badMouseEvent);
      expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should change translationOrigin when mouseDown and inSelection', () => {
      spyOn(service, 'isInSelection').and.returnValue(true);
      let saveTranslation : Vec2 = (service as any).translationOrigin;
      service.onMouseDown(mouseEvent);
      expect((service as any).translationOrigin).not.toEqual(saveTranslation);
    });

});
