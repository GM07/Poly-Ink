import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EllipseSelectionService } from './ellipse-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from '@app/classes/vec2';

//TODO ajouter des tests d'intégrations pour vérifier que les éléments sont correctement dessinés?

describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
          providers: [{ provide: DrawingService, useValue: drawServiceSpy }]
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseSelectionService);
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].baseCtx = baseCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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

    it('draw selection should draw an ellipse and a border around the selection', () => {
      spyOn(baseCtxStub, 'ellipse');
      spyOn(baseCtxStub, 'setLineDash');
      (service as any).drawSelection(baseCtxStub, {x: 10, y: 25} as Vec2);
      expect(baseCtxStub.ellipse).toHaveBeenCalledTimes(2);
      expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it('draw rectangle perimeter should draw a rectangle', () => {
      spyOn(previewCtxStub, 'strokeRect');
      spyOn(previewCtxStub, 'stroke');
      (service as any).drawRectanglePerimeter(previewCtxStub, {x: 10, y: 25} as Vec2);
      expect(previewCtxStub.strokeRect).toHaveBeenCalled();
      expect(previewCtxStub.stroke).toHaveBeenCalled();
    });

    it('fill background should fill an ellipse at the location', () => {
      (service as any).firstSelectionCoords = {x: 0, y: 0} as Vec2;
      spyOn(previewCtxStub, 'ellipse');
      spyOn(previewCtxStub, 'fill');
      (service as any).fillBackground(previewCtxStub, 10, 25);
      expect(previewCtxStub.ellipse).toHaveBeenCalled();
      expect(previewCtxStub.fill).toHaveBeenCalled();
    });

    it('update selection required should clip the image, draw it, update it and update the background', () => {
      (service as any).selectionCoords =  {x: 0, y: 0 } as Vec2;
      spyOn(previewCtxStub, 'ellipse');
      spyOn(previewCtxStub, 'clip');
      spyOn(previewCtxStub, 'drawImage');
      spyOn(service as any, 'fillBackground');
      spyOn(service as any, 'drawSelection');
      (service as any).updateSelectionRequired();
      expect(previewCtxStub.ellipse).toHaveBeenCalled();
      expect(previewCtxStub.clip).toHaveBeenCalled();
      expect(previewCtxStub.drawImage).toHaveBeenCalled();
      expect((service as any).fillBackground).toHaveBeenCalled();
      expect((service as any).drawSelection).toHaveBeenCalled();
    });


    it('end selection should do nothing if there is no selection', () => {
      (service as any).endSelection();
      spyOn(service as any, 'fillBackground');
      expect((service as any).fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () =>{
      (service as any).selectionCtx = previewCtxStub;
      (service as any).selectionCoords =  {x: 0, y: 0 } as Vec2;
      spyOn(baseCtxStub, 'ellipse');
      spyOn(baseCtxStub, 'clip');
      spyOn(baseCtxStub, 'drawImage');
      spyOn(service as any, 'fillBackground');
      (service as any).endSelection();
      expect(baseCtxStub.ellipse).toHaveBeenCalled();
      expect(baseCtxStub.clip).toHaveBeenCalled();
      expect(baseCtxStub.drawImage).toHaveBeenCalled();
      expect((service as any).fillBackground).toHaveBeenCalled();
    });

    it('draw selection should draw the rectangle perimeter if there is a selection', () => {
      (service as any).selectionCtx = previewCtxStub;
      spyOn(service as any, 'drawRectanglePerimeter');
      (service as any).drawSelection(previewCtxStub, {x: 0, y:0 } as Vec2);
      expect((service as any).drawRectanglePerimeter).toHaveBeenCalled();
    });

    it('fill background should do nothing if the mouse hasn\'t move', () => {
      (service as any).firstSelectionCoords = {x: 0, y: 0};
      spyOn(previewCtxStub, 'beginPath');
      (service as any).fillBackground(previewCtxStub, 0, 0);
      expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });

});
