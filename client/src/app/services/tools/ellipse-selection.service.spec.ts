import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { EllipseSelectionService } from './ellipse-selection.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw'], { changes: new Subject<void>() });
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
        const saveWidth = (service.config.width = 5);
        const saveHeight = (service.config.height = 25);
        service.mouseDownCoord = new Vec2(0, 0);
        service['drawPreviewSelectionRequired']();
        expect(saveWidth).toEqual(service.config.width);
        expect(saveHeight).toEqual(service.config.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and change size if shift has changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.config.width = 5);
        const saveHeight = (service.config.height = 25);
        service.config.shift.isDown = true;
        service.mouseDownCoord = new Vec2(0, 0);
        service['drawPreviewSelectionRequired']();
        expect(saveWidth).toEqual(service.config.width);
        expect(saveHeight).not.toEqual(service.config.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('draw selection should draw an ellipse and a border around the selection', () => {
        spyOn(baseCtxStub, 'ellipse');
        spyOn(baseCtxStub, 'setLineDash');
        service['drawSelection'](baseCtxStub, new Vec2(10, 25), new Vec2(0, 0));
        expect(baseCtxStub.ellipse).toHaveBeenCalledTimes(2);
        expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it('fill background should fill an ellipse at the location', () => {
        service.config.startCoords = new Vec2(0, 0);
        service.config.endCoords = new Vec2(0, 0);
        spyOn(previewCtxStub, 'ellipse');
        spyOn(previewCtxStub, 'fill');
        spyOn(service.config, 'didChange').and.returnValue(true);
        service['fillBackground'](previewCtxStub, { x: 10, y: 25 } as Vec2);
        expect(previewCtxStub.ellipse).toHaveBeenCalled();
        expect(previewCtxStub.fill).toHaveBeenCalled();
    });

    it('update selection required should clip the image, draw it, update it and update the background', () => {
        service.config.width = 1;
        service.config.height = 1;
        service.config.endCoords = new Vec2(0, 0);
        spyOn(previewCtxStub, 'ellipse');
        spyOn(previewCtxStub, 'clip');
        spyOn(previewCtxStub, 'drawImage');
        spyOn(service.config, 'didChange').and.returnValue(true);
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
        spyOn(service.config, 'didChange').and.returnValue(true);
        const fillBackground = spyOn<any>(service, 'fillBackground');
        service['endSelection']();
        expect(fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () => {
        service['config'].selectionCtx = previewCtxStub;
        service.config.endCoords = new Vec2(0, 0);
        service.config.width = 1;
        service.config.height = 1;
        spyOn(service, 'draw').and.stub();
        service['endSelection']();
        expect(service.draw).toHaveBeenCalled();
    });

    it('fill background should do nothing if the mouse has not moved', () => {
        service.config.startCoords = new Vec2(0, 0);
        spyOn(service.config, 'didChange').and.returnValue(false);
        spyOn(previewCtxStub, 'beginPath');
        service['fillBackground'](previewCtxStub, new Vec2(0, 0));
        expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        service.draw();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });
});
