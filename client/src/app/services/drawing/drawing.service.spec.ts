import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { PencilDraw } from '@app/classes/commands/pencil-draw';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from './drawing.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let command: AbstractDraw;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        const pencilConfigSpy = jasmine.createSpyObj('PencilConfig', ['clone']);
        command = new PencilDraw({} as ColorService, pencilConfigSpy);
        service.magnetismService.gridService.canvas = document.createElement('canvas');
        service.magnetismService.gridService.ctx = service.magnetismService.gridService.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should not load and undefined drawing', async () => {
        spyOn(service.baseCtx, 'drawImage');
        await service.loadDrawing();
        expect(service.baseCtx.drawImage).not.toHaveBeenCalled();
    });

    it('should load a defined drawing', async () => {
        spyOn(service.baseCtx, 'drawImage');
        spyOn(service, 'resizeCanvas');
        service.loadedCanvas = service.canvas;
        await service.loadDrawing();
        expect(service.baseCtx.drawImage).toHaveBeenCalled();
    });

    it('should load drawing from local storage if editor is reloading', async () => {
        spyOn<any>(service, 'isReloading').and.returnValue(true);
        spyOn(service, 'createLoadedCanvasFromStorage').and.resolveTo();
        await service.loadDrawing();
        expect(service.createLoadedCanvasFromStorage).toHaveBeenCalled();
    });

    it('draw should execute command on base canvas', () => {
        spyOn(command, 'execute').and.stub();
        service.draw(command);
        expect(command.execute).toHaveBeenCalledWith(service.baseCtx);
    });

    it('drawPreview should clear preview', () => {
        spyOn(command, 'execute').and.stub();
        spyOn(service, 'clearCanvas').and.stub();
        service.drawPreview(command);
        expect(service.clearCanvas).toHaveBeenCalled();
    });

    it('drawPreview should execute command on preview', () => {
        spyOn(command, 'execute').and.stub();
        spyOn(service, 'clearCanvas').and.stub();
        service.drawPreview(command);
        expect(command.execute).toHaveBeenCalledWith(service.previewCtx);
    });

    it('passdrawPreview should execute command on preview', () => {
        spyOn(command, 'execute').and.stub();
        spyOn(service, 'clearCanvas').and.stub();
        service.drawStampPreview(command);
        expect(command.execute).toHaveBeenCalledWith(service.previewCtx);
    });

    it('should block undo redo properly', () => {
        service.blockUndoRedo();
        expect(service['undoRedoService'].blockUndoRedo).toBeTruthy();
    });

    it('should block undo redo properly', () => {
        service.unblockUndoRedo();
        expect(service['undoRedoService'].blockUndoRedo).toBeFalsy();
    });

    it('should initialize the loadedCanvas from localStorage if reloading', () => {
        spyOn<any>(service, 'isReloading').and.returnValue(true);
        spyOn(service, 'createLoadedCanvasFromStorage');
        service.initLoadedCanvas();
        expect(service.createLoadedCanvasFromStorage).toHaveBeenCalledWith();
    });

    it('should initialize the loadedCanvas to undefined if not reloading', () => {
        spyOn<any>(service, 'isReloading').and.returnValue(false);
        spyOn(service, 'createLoadedCanvasFromStorage');
        service.initLoadedCanvas();
        expect(service.createLoadedCanvasFromStorage).not.toHaveBeenCalledWith();
        expect(service.loadedCanvas).toBeUndefined();
    });

    it('should not save to local storage while resizing canvas if editor is reloading', () => {
        spyOn<any>(service, 'save');
        spyOn<any>(service, 'isReloading').and.returnValue(true);
        spyOn<any>(DrawingService, 'saveCanvas');
        spyOn(service, 'initBackground');
        spyOn(service.baseCtx, 'drawImage');
        spyOn(service.previewCtx, 'drawImage');
        spyOn(service.magnetismService.gridService, 'updateGrid');
        service.previewCanvas = canvasTestHelper.canvas;
        service.magnetismService.gridService.canvas = canvasTestHelper.canvas;
        service.resizeCanvas(0, 0);
        expect(service['save']).not.toHaveBeenCalled();
    });

    it('should save to local storage while initializing background if editor is not reloading', () => {
        spyOn<any>(service, 'save');
        spyOn<any>(service, 'isReloading').and.returnValue(false);
        spyOn<any>(DrawingService, 'saveCanvas');
        spyOn(service, 'initBackground');
        spyOn(service.baseCtx, 'drawImage');
        spyOn(service.previewCtx, 'drawImage');
        spyOn(service.magnetismService.gridService, 'updateGrid');
        service.previewCanvas = canvasTestHelper.canvas;
        service.magnetismService.gridService.canvas = canvasTestHelper.canvas;
        service.resizeCanvas(0, 0);
        expect(service['save']).toHaveBeenCalled();
    });

    it('should save to local storage when a tool draws', () => {
        spyOn<any>(service, 'save');
        spyOn(command, 'execute').and.stub();
        service.draw(command);
        expect(service['save']).toHaveBeenCalled();
    });

    it('should not save to local storage while initializing background if editor is reloading', () => {
        spyOn<any>(service, 'save');
        spyOn<any>(service, 'isReloading').and.returnValue(true);
        service.initBackground();
        expect(service['save']).not.toHaveBeenCalled();
    });

    it('should save to local storage while initializing background if editor is not reloading', () => {
        spyOn<any>(service, 'save');
        spyOn<any>(service, 'isReloading').and.returnValue(false);
        service.initBackground();
        expect(service['save']).toHaveBeenCalled();
    });

    it('should get the drawing from local storage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('test_drawing');
        service.getSavedDrawing();
        expect(localStorage.getItem).toHaveBeenCalledWith('drawing');
        expect(service.getSavedDrawing()).toEqual('test_drawing');
    });

    it('should remove realoading flag from local storage', () => {
        spyOn(localStorage, 'removeItem');
        service['setIsDoneReloading']();
        expect(localStorage.removeItem).toHaveBeenCalledWith('editor_reloading');
    });

    it('should remove realoading flag from local storage', () => {
        spyOn(localStorage, 'removeItem');
        service['setIsDoneReloading']();
        expect(localStorage.removeItem).toHaveBeenCalledWith('editor_reloading');
    });

    it('should return true when an item with editor_reloading key exists in local storage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('true');
        expect(service['isReloading']()).toEqual(true);
    });

    it('should return false when an item with editor_reloading key does not exist in local storage', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        expect(service['isReloading']()).toEqual(false);
    });

    it('should save the canvas to local storage', () => {
        spyOn(localStorage, 'setItem');
        service['save'](service.baseCtx);
        expect(localStorage.setItem).toHaveBeenCalledWith('drawing', service.canvas.toDataURL());
    });

    it('should create a loaded canvas from storage', async () => {
        spyOn(service, 'getSavedDrawing').and.returnValue(service.canvas.toDataURL());
        expect(service.loadedCanvas).toBeUndefined();
        await service.createLoadedCanvasFromStorage();
        expect(service.loadedCanvas?.height).toEqual(250);
        expect(service.loadedCanvas?.width).toEqual(250);
    });

    it('should not change the loaded canvas if the saved drawing in local storage is null', async () => {
        spyOn(service, 'getSavedDrawing').and.returnValue(null);
        expect(service.loadedCanvas).toBeUndefined();
        await service.createLoadedCanvasFromStorage();
        expect(service.loadedCanvas).toBeUndefined();
    });

    it('should remove the saved drawing from local storage', () => {
        spyOn(localStorage, 'removeItem');
        service.removeSavedDrawing();
        expect(localStorage.removeItem).toHaveBeenCalledWith('drawing');
    });
});
