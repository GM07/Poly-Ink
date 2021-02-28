import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { RectangleSelectionService } from './rectangle-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

//TODO should use the canvasTestHelper

describe('RectangleSelectionService', () => {
    let service: RectangleSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSelection: HTMLCanvasElement;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D

    let mouseEvent = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
  } as MouseEvent;

    beforeEach(() => {
      drawServiceSpy = jasmine.createSpyObj('DrawigSnervice', ['clearCanvas']);
        TestBed.configureTestingModule({
          providers: [
            { provide: DrawingService, useValue: drawServiceSpy },
        ],
        });
        service = TestBed.inject(RectangleSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSelection = document.createElement('canvas');
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw set mouseDown and mouseUp to same coordinate on mouseDown outside of selection', () => {
      spyOn(service as any, 'endSelection');
      spyOn(service as any, 'drawPreviewSelection');
      spyOn(service, 'isInSelection').and.returnValue(false);
      service.onMouseDown(mouseEvent);
      expect((service as any).mouseDownCoord).toEqual((service as any).mouseUpCoord);
    });

    it('on mouse up should set mousePosition and clear canvas if in canvas', () => {
      (service as any).mouseDown = true;
      spyOn(service as any, 'getPositionFromMouse');
      spyOn(service, 'isInCanvas').and.returnValue(true);
      spyOn(service as any, 'startSelection');
      service.onMouseUp(mouseEvent);
      expect((service as any).getPositionFromMouse).toHaveBeenCalled();
      expect((service as any).startSelection).toHaveBeenCalled();
    });

    it('on mouse up should move selection if canvas is set', () => {
      (service as any).mouseDown = true;
      spyOn(service, 'isInCanvas').and.returnValue(false);
      spyOn(service as any, 'getTranslation').and.returnValue({x: 0, y: 0} as Vec2);
      spyOn(service as any, 'updateSelection');
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      service.onMouseUp(mouseEvent);
      expect((service as any).updateSelection).toHaveBeenCalled();
    })

    it('should draw preview on mouse move', () => {
      (service as any).mouseUpCoord = ({x: 0, y: 0} as Vec2);
      (service as any).mouseDown = true;
      spyOn((service as any), 'drawPreviewSelection');
      spyOn(service, 'isInCanvas').and.returnValue(true);
      service.onMouseMove(mouseEvent);
      expect((service as any).drawPreviewSelection).toHaveBeenCalled();
      expect((service as any).mouseUpCoord).not.toEqual({x: 0, y: 0} as Vec2);
    });

    it('should update the selection on mouse move if the selection is not null', () => {
      (service as any).mouseDown = true;
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      spyOn((service as any), 'updateSelection');
      spyOn(service as any, 'getTranslation');
      spyOn(service, 'isInCanvas').and.returnValue(false);
      service.onMouseMove(mouseEvent);
      expect((service as any).updateSelection).toHaveBeenCalled();
    });

    it('should stop drawing when the esc key is pressed', () => {
      let keyboardEvent = {key: 'escape', ctrlKey: false, shiftKey: false, altKey: false} as KeyboardEvent;
      spyOn(service, 'stopDrawing');
      service.onKeyDown(keyboardEvent);
      expect(service.stopDrawing).toHaveBeenCalled();
    });

    it('should select all when alt+a is pressed', () => {
      let keyboardEvent = new KeyboardEvent('document:keydown', {key: 'a', ctrlKey: true, shiftKey: false, altKey: false});
      spyOn(service, 'selectAll');
      service.onKeyDown(keyboardEvent);
      expect(service.selectAll).toHaveBeenCalled();
    });

    it('should update the rectangle on shift pressed', () => {
      let keyboardEvent = {ctrlKey: false, shiftKey: true, altKey: false} as KeyboardEvent;
      (service as any).mouseDown = true;
      spyOn(service as any, 'updateDrawingSelection');
      service.onKeyDown(keyboardEvent);
      expect((service as any).updateDrawingSelection).toHaveBeenCalled();
    });

   it('it should move the selection when there is a selection and an arrow is pressed', () => {
      jasmine.clock().install()
      let keyboardEvent = new KeyboardEvent('keydown', {key: 'arrowdown'});
      spyOn(service as any, 'updateSelection');
      spyOn(service as any, 'getXArrow').and.returnValue(1);
      spyOn(service as any, 'getYArrow').and.returnValue(1);
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      service.onKeyDown(keyboardEvent);
      jasmine.clock().tick(600);
      expect((service as any).updateSelection).toHaveBeenCalled();
      expect((service as any).updateSelection).toHaveBeenCalledTimes(2);
      jasmine.clock().uninstall()
    });

    it('should not move the selection multiple times if the key was pressed multiple times', () => {
      jasmine.clock().install();
      spyOn(service as any, 'updateSelection');
      let keyboardEvent = new KeyboardEvent('keydown', {key: 'arrowdown'});
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      service.onKeyDown(keyboardEvent);
      jasmine.clock().tick(200);
      (service as any).moveId = 1;
      jasmine.clock().tick(350);
      expect((service as any).updateSelection).toHaveBeenCalledTimes(1);
      jasmine.clock().uninstall();
    });

    it('should not move the selection if it is already moving', () => {
      jasmine.clock().install();
      spyOn(service as any, 'updateSelection');
      let keyboardEvent = new KeyboardEvent('keydown', {key: 'arrowdown'});
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      (service as any).moveId = 1;
      service.onKeyDown(keyboardEvent);
      jasmine.clock().tick(500);
      expect((service as any).updateSelection).toHaveBeenCalledTimes(1);
      jasmine.clock().uninstall();
    });

    it('should update the selection when key up', () => {
      let keyboardEvent = {ctrlKey: false, shiftKey: false, altKey: false} as KeyboardEvent;
      (service as any).shiftPressed = true;
      (service as any).mouseDown = true;
      spyOn(service as any, 'updateDrawingSelection');
      service.onKeyUp(keyboardEvent);
      expect((service as any).updateDrawingSelection).toHaveBeenCalled();
    });

    it('should update arrowkey on key up', () => {
      let keyboardEvent = {ctrlKey: false, shiftKey: false, altKey: false} as KeyboardEvent;
      spyOn(service as any, 'setArrowKeyUp');
      spyOn(window, 'clearInterval');
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      service.onKeyUp(keyboardEvent);
      expect(window.clearInterval).toHaveBeenCalled();
    });

    it('select all should set mouseDownCoord to upleft and mouseUp coord to bottom left', () => {
      drawServiceSpy.canvas = document.createElement('canvas');
      drawServiceSpy.canvas.width = 10;
      drawServiceSpy.canvas.height = 10;
      let mouseDown = {x: 0, y: 0} as Vec2;
      let mouseUp = {x: drawServiceSpy.canvas.width, y: drawServiceSpy.canvas.height} as Vec2;
      spyOn(service as any, 'stopDrawing');
      spyOn(service as any, 'startSelection');
      service.selectAll();
      expect(mouseDown).toEqual((service as any).mouseDownCoord);
      expect(mouseUp).toEqual((service as any).mouseUpCoord);
    });

    it('should call endSelection and clear the preview on stop drawing', () => {
      spyOn(service as any, 'endSelection');
      service.stopDrawing();
      expect((service as any).endSelection).toHaveBeenCalled();
      expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('start selection should do nothing if width or height is not set', () => {
      (service as any).width = 0;
      spyOn((service as any), 'drawPreviewSelection');
      (service as any).startSelection();
      expect((service as any).drawPreviewSelection).not.toHaveBeenCalled();
    })

    it('start selection should init needed variables', () => {
      (service as any).width = 100;
      (service as any).height = 100;
      (service as any).mouseDownCoord = {x: 25, y: 25} as Vec2;
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      canvasSelection.width = 250;
      canvasSelection.height = 250;
      drawServiceSpy.previewCanvas = document.createElement('canvas');
      drawServiceSpy.previewCtx = drawServiceSpy.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
      (service as any).SELECTION_DATA = canvasSelection;
      spyOn((service as any), 'drawPreviewSelection');
      spyOn(drawServiceSpy.previewCtx, 'drawImage');
      spyOn((service as any).selectionCtx, 'drawImage');
      (service as any).startSelection();
      expect(drawServiceSpy.previewCtx.drawImage).toHaveBeenCalled();
      expect((service as any).drawPreviewSelection).toHaveBeenCalled();
    });

    it('update drawing should clear canvas and draw new preview', () => {
      spyOn(service as any, 'drawPreviewSelection');
      (service as any).updateDrawingSelection();
      expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
      expect((service as any).drawPreviewSelection).toHaveBeenCalled();
    });

    it('update selection should do nothing if there is no selection', () => {
      spyOn(service as any, 'updateSelectionRequired');
      (service as any).updateSelection();
      expect((service as any).updateSelectionRequired).not.toHaveBeenCalled();
    });

    it('update selection should call the child class to update', () => {
      const translation = {x: 0, y: 0} as Vec2;
      spyOn(service as any, 'updateSelectionRequired');
      (service as any).selectionCoords = {x: 0, y: 0} as Vec2;
      (service as any).translationOrigin = {x: 0, y: 0} as Vec2;
      (service as any).selectionCtx = canvasSelection.getContext('2d');
      (service as any).updateSelection(translation);
      expect((service as any).updateSelectionRequired).toHaveBeenCalled();
    });

    it('draw preview should update width and height and call child method', () => {
      (service as any).mouseUpCoord = {x: 25, y: 25} as Vec2;
      (service as any).mouseDownCoord = {x: 0, y: 0} as Vec2;
      spyOn(service as any, 'drawPreviewSelectionRequired');
      (service as any).drawPreviewSelection();
      expect((service as any).width).toEqual(25);
      expect((service as any).height).toEqual(25);
      expect((service as any).drawPreviewSelectionRequired).toHaveBeenCalled();
    });

    it('isInCanvas should return true if is in canvas', () => {
      drawServiceSpy.canvas = document.createElement('canvas');
      drawServiceSpy.canvas.width = 30;
      drawServiceSpy.canvas.height = 30;
      (service as any).BORDER_WIDTH = 0;
      expect((service as any).isInCanvas(mouseEvent)).toBe(true);
    });

    it('end selection should do nothing if there is no selection', () => {
      (service as any).endSelection();
      spyOn(service as any, 'fillBackground');
      expect((service as any).fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () =>{
      (service as any).selectionCtx = previewCtxStub;
      (service as any).selectionCoords =  {x: 0, y: 0 } as Vec2;
      spyOn(baseCtxStub, 'drawImage');
      spyOn(service as any, 'fillBackground');
      (service as any).endSelection();
      expect(baseCtxStub.drawImage).toHaveBeenCalled();
      expect((service as any).fillBackground).toHaveBeenCalled();
    });

    it('fill background should fill a rectangle at the location', () => {
      (service as any).firstSelectionCoords = {x: 0, y: 0} as Vec2;
      spyOn(previewCtxStub, 'fillRect');
      (service as any).fillBackground(previewCtxStub, 10, 25);
      expect(previewCtxStub.fillRect).toHaveBeenCalled();
    });

    it('update selection required should draw the image, update it and update the background', () => {
      (service as any).selectionCoords =  {x: 0, y: 0 } as Vec2;
      spyOn(previewCtxStub, 'drawImage');
      spyOn(service as any, 'fillBackground');
      spyOn(service as any, 'drawSelection');
      (service as any).updateSelectionRequired();
      expect(previewCtxStub.drawImage).toHaveBeenCalled();
      expect((service as any).fillBackground).toHaveBeenCalled();
      expect((service as any).drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and not change size if shift hasnt changed', () => {
      spyOn(service as any, 'drawSelection');
      let saveWidth = (service as any).width = 5;
      let saveHeight = (service as any).height = 25;
      (service as any).mouseDownCoord = {x: 0, y: 0} as Vec2;
      (service as any).drawPreviewSelectionRequired(baseCtxStub);
      expect(saveWidth).toEqual((service as any).width);
      expect(saveHeight).toEqual((service as any).height);
      expect((service as any).drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and change size if shift has changed', () => {
      spyOn(service as any, 'drawSelection');
      let saveWidth = (service as any).width = 5;
      let saveHeight = (service as any).height = 25;
      (service as any).shiftPressed = true;
      (service as any).mouseDownCoord = {x: 0, y: 0} as Vec2;
      (service as any).drawPreviewSelectionRequired(baseCtxStub);
      expect(saveWidth).toEqual((service as any).width);
      expect(saveHeight).not.toEqual((service as any).height);
      expect((service as any).drawSelection).toHaveBeenCalled();
    });

    it('draw selection should draw a rectangle and a border around the selection', () => {
      spyOn(baseCtxStub, 'strokeRect');
      spyOn(baseCtxStub, 'setLineDash');
      (service as any).drawSelection(baseCtxStub, {x: 10, y: 25} as Vec2);
      expect(baseCtxStub.strokeRect).toHaveBeenCalledTimes(2);
      expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it('fill background should do nothing if the mouse hasn\'t move', () => {
      (service as any).firstSelectionCoords = {x: 0, y: 0};
      spyOn(previewCtxStub, 'beginPath');
      (service as any).fillBackground(previewCtxStub, 0, 0);
      expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });
});
