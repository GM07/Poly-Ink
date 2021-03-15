import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { Colors } from 'src/color-picker/constants/colors';
import { UndoRedoService } from './undo-redo.service';
describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let resizeDraw: ResizeDraw;

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(UndoRedoService);
        resizeDraw = jasmine.createSpyObj('ResizeDraw', ['execute']);
        service.init(baseCtxStub, previewCtxStub, resizeDraw);
    });

    it('should init properly', () => {
        expect(service.preview).toBe(previewCtxStub);
        expect(service.context).toBe(baseCtxStub);
        expect(service.originalResize).toBe(resizeDraw);
    });

    it('should increase counter and save new command', () => {
        service.saveCommand(resizeDraw);
        expect(service.commands.length).toEqual(1);
        expect(service.currentAction).toEqual(0);
    });

    it('should break undo-redo sequence when a new action saved', () => {
        const nbCommands = 4;

        for (let i = 0; i < nbCommands; i++) service.saveCommand(resizeDraw);

        expect(service.commands.length).toEqual(nbCommands);

        service.currentAction = 0;
        service.saveCommand(resizeDraw);
        expect(service.commands.length).toEqual(2);
    });

    it('should make appropriate calls on undo', () => {
        const nbCommands = 4;
        spyOn(baseCtxStub, 'putImageData').and.stub();
        spyOn(service, 'isPreviewEmpty').and.returnValue(true);
        for (let i = 0; i < nbCommands; i++) service.saveCommand(resizeDraw);

        service.undo();

        expect(baseCtxStub.putImageData).toHaveBeenCalled();
        expect(service.isPreviewEmpty).toHaveBeenCalled();
        expect(resizeDraw.execute).toHaveBeenCalledTimes(nbCommands);
    });

    it('should not undo if something is on preview', () => {
        spyOn(service, 'isPreviewEmpty').and.returnValue(false);
        spyOn(baseCtxStub, 'putImageData').and.stub();
        service.currentAction = 2;
        service.undo();

        expect(baseCtxStub.putImageData).not.toHaveBeenCalled();
        expect(resizeDraw.execute).not.toHaveBeenCalled();
    });

    it('should not undo if there is nothing to undo', () => {
        const invalidActionNumber = -1;
        spyOn(baseCtxStub, 'putImageData').and.stub();

        service.currentAction = invalidActionNumber;

        service.undo();

        expect(baseCtxStub.putImageData).not.toHaveBeenCalled();
        expect(resizeDraw.execute).not.toHaveBeenCalled();
    });

    it('should make appropriate calls on redo', () => {
        const nbCommands = 4;
        spyOn(baseCtxStub, 'putImageData').and.stub();
        spyOn(service, 'isPreviewEmpty').and.returnValue(true);
        for (let i = 0; i < nbCommands; i++) service.saveCommand(resizeDraw);

        service.currentAction = 0;
        service.redo();

        expect(service.isPreviewEmpty).toHaveBeenCalled();
        expect(resizeDraw.execute).toHaveBeenCalled();
    });

    it('should not redo if something is on preview', () => {
        const nbCommands = 4;
        spyOn(service, 'isPreviewEmpty').and.returnValue(false);
        for (let i = 0; i < nbCommands; i++) service.saveCommand(resizeDraw);

        service.currentAction = 0;
        service.redo();

        expect(resizeDraw.execute).not.toHaveBeenCalled();
    });

    it('should not redo if there is nothing to redo', () => {
        service.currentAction = service.commands.length - 1;
        service.redo();
        expect(resizeDraw.execute).not.toHaveBeenCalled();
    });

    it('should return true on empty preview', () => {
        expect(service.isPreviewEmpty()).toBeTrue();
    });

    it('should return false when preview not empty', () => {
        service.preview.fillStyle = Colors.BLACK.rgbString;
        service.preview.fillRect(0, 0, 1, 1);
        expect(service.isPreviewEmpty()).toBeFalse();
    });
});
