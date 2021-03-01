import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseSelectionService } from './ellipse-selection.service';

// TODO ajouter des tests d'intégrations pour vérifier que les éléments sont correctement dessinés?

describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
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
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.width = 5);
        const saveHeight = (service.height = 25);
        service.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        service['drawPreviewSelectionRequired'](baseCtxStub);
        expect(saveWidth).toEqual(service.width);
        expect(saveHeight).toEqual(service.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and change size if shift has changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.width = 5);
        const saveHeight = (service.height = 25);
        service['shiftPressed'] = true;
        service.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        service['drawPreviewSelectionRequired'](baseCtxStub);
        expect(saveWidth).toEqual(service.width);
        expect(saveHeight).not.toEqual(service.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('draw selection should draw an ellipse and a border around the selection', () => {
        spyOn(baseCtxStub, 'ellipse');
        spyOn(baseCtxStub, 'setLineDash');
        service['drawSelection'](baseCtxStub, { x: 10, y: 25 } as Vec2);
        expect(baseCtxStub.ellipse).toHaveBeenCalledTimes(2);
        expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it('draw rectangle perimeter should draw a rectangle', () => {
        spyOn(previewCtxStub, 'strokeRect');
        spyOn(previewCtxStub, 'stroke');
        service['drawRectanglePerimeter'](previewCtxStub, { x: 10, y: 25 } as Vec2);
        expect(previewCtxStub.strokeRect).toHaveBeenCalled();
        expect(previewCtxStub.stroke).toHaveBeenCalled();
    });

    it('fill background should fill an ellipse at the location', () => {
        service['firstSelectionCoords'] = { x: 0, y: 0 } as Vec2;
        spyOn(previewCtxStub, 'ellipse');
        spyOn(previewCtxStub, 'fill');
        service['fillBackground'](previewCtxStub, 10, 25);
        expect(previewCtxStub.ellipse).toHaveBeenCalled();
        expect(previewCtxStub.fill).toHaveBeenCalled();
    });

    it('update selection required should clip the image, draw it, update it and update the background', () => {
        service.selectionCoords = { x: 0, y: 0 } as Vec2;
        spyOn(previewCtxStub, 'ellipse');
        spyOn(previewCtxStub, 'clip');
        spyOn(previewCtxStub, 'drawImage');
        const fillBackground = spyOn<any>(service, 'fillBackground');
        const drawSelection = spyOn<any>(service, 'drawSelection');
        service['updateSelectionRequired']();
        expect(previewCtxStub.ellipse).toHaveBeenCalled();
        expect(previewCtxStub.clip).toHaveBeenCalled();
        expect(previewCtxStub.drawImage).toHaveBeenCalled();
        expect(fillBackground).toHaveBeenCalled();
        expect(drawSelection).toHaveBeenCalled();
    });

    it('end selection should do nothing if there is no selection', () => {
        const fillBackground = spyOn<any>(service, 'fillBackground');
        service['endSelection']();
        expect(fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () => {
        service.selectionCtx = previewCtxStub;
        service.selectionCoords = { x: 0, y: 0 } as Vec2;
        spyOn(baseCtxStub, 'ellipse');
        spyOn(baseCtxStub, 'clip');
        spyOn(baseCtxStub, 'drawImage');
        const fillBackground = spyOn<any>(service, 'fillBackground');
        service['endSelection']();
        expect(baseCtxStub.ellipse).toHaveBeenCalled();
        expect(baseCtxStub.clip).toHaveBeenCalled();
        expect(baseCtxStub.drawImage).toHaveBeenCalled();
        expect(fillBackground).toHaveBeenCalled();
    });

    it('draw selection should draw the rectangle perimeter if there is a selection', () => {
        service.selectionCtx = previewCtxStub;
        const drawRectanglePerimeter = spyOn<any>(service, 'drawRectanglePerimeter');
        service['drawSelection'](previewCtxStub, { x: 0, y: 0 } as Vec2);
        expect(drawRectanglePerimeter).toHaveBeenCalled();
    });

    it("fill background should do nothing if the mouse hasn't move", () => {
        service['firstSelectionCoords'] = { x: 0, y: 0 };
        spyOn(previewCtxStub, 'beginPath');
        service['fillBackground'](previewCtxStub, 0, 0);
        expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });
});
