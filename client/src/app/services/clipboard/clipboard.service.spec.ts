import { TestBed } from '@angular/core/testing';
import { PencilService } from '@app/services/tools/pencil.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { ClipboardService } from './clipboard.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('ClipboardService', () => {
    let service: ClipboardService;
    let toolHandlerService: ToolHandlerService;
    let rectangleSelectionService: RectangleSelectionService;
    let pencilService: PencilService;
    let getCurrentToolSpy: jasmine.Spy<any>;

    let ctxStub: CanvasRenderingContext2D;

    const copyKey = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
    const pasteKey = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
    const cutKey = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true });
    const deleteKey = new KeyboardEvent('keydown', { key: 'delete' });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClipboardService);
        toolHandlerService = TestBed.inject(ToolHandlerService);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);
        pencilService = TestBed.inject(PencilService);

        getCurrentToolSpy = spyOn(toolHandlerService, 'getCurrentTool').and.returnValue(rectangleSelectionService);
        spyOn(toolHandlerService, 'setTool');
        spyOn(rectangleSelectionService, 'initAttribs');

        service['lastSelectionTool'] = rectangleSelectionService;
        const canvas = document.createElement('canvas');
        ctxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not detect clipborad events if the current tool has the leftMouse down', () => {
        rectangleSelectionService.leftMouseDown = true;
        const pasteSpy = spyOn<any>(service, 'pasteDrawing');
        service.onKeyDown(pasteKey);
        expect(pasteSpy).not.toHaveBeenCalled();
    });

    it('should detect the copy key if using a selection tool', () => {
        const copySpy = spyOn<any>(service, 'copyDrawing');
        service.onKeyDown(copyKey);
        expect(copySpy).toHaveBeenCalled();
    });

    it('should detect the paste key if using a selection tool', () => {
        const pasteSpy = spyOn<any>(service, 'pasteDrawing');
        service.onKeyDown(pasteKey);
        expect(pasteSpy).toHaveBeenCalled();
    });

    it('should detect the cut key if using a selection tool', () => {
        const copySpy = spyOn<any>(service, 'copyDrawing');
        const deleteSpy = spyOn<any>(service, 'deleteDrawing');
        service.onKeyDown(cutKey);
        expect(copySpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('should detect the delete key if using a selection tool', () => {
        const deleteSpy = spyOn<any>(service, 'deleteDrawing');
        service.onKeyDown(deleteKey);
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('should detect the paste key even if not using a selection tool', () => {
        getCurrentToolSpy.and.returnValue(pencilService);
        const pasteSpy = spyOn<any>(service, 'pasteDrawing');
        service.onKeyDown(pasteKey);
        expect(pasteSpy).toHaveBeenCalled();
    });

    it('should not mark the clipboard as initialised if the current selection is another object', () => {
        getCurrentToolSpy.and.returnValue(pencilService);
        service.INITIALISATION_SIGNAL.next(true);
        expect(service['isInitialised']).toBeFalsy();
    });

    it('should only mark the clipboard as initialised if it does not need to paste', () => {
        const updateSpy = spyOn(service['lastSelectionTool'], 'updateSelection');
        service['wantsToPaste'] = false;
        service.INITIALISATION_SIGNAL.next(true);
        expect(updateSpy).not.toHaveBeenCalled();
        expect(service['isInitialised']).toBeTruthy();
    });

    it('should update the selection if it wants to paste', () => {
        const updateSpy = spyOn(service['lastSelectionTool'], 'updateSelection');
        service['wantsToPaste'] = true;
        service['isInitialised'] = false;
        service.INITIALISATION_SIGNAL.next(true);
        expect(updateSpy).toHaveBeenCalled();
        expect(service['isInitialised']).toBeTruthy();
    });

    it('should copy a drawing', () => {
        const cloneSpy = spyOn(service['lastSelectionTool'].config, 'clone').and.callThrough();
        service['copyDrawing']();
        expect(cloneSpy).not.toHaveBeenCalled();
        service['lastSelectionTool'].config.previewSelectionCtx = ctxStub;
        service['copyDrawing']();
        expect(cloneSpy).toHaveBeenCalled();
    });

    it('should delete a drawing', () => {
        const stopDrawingSpy = spyOn(service['lastSelectionTool'], 'stopDrawing');
        service['deleteDrawing']();
        expect(stopDrawingSpy).not.toHaveBeenCalled();
        service['lastSelectionTool'].config.previewSelectionCtx = ctxStub;
        service['deleteDrawing']();
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('should not paste a drawing if there is nothing to paste', () => {
        const stopDrawingSpy = spyOn(rectangleSelectionService, 'stopDrawing');
        service['pasteDrawing']();
        expect(stopDrawingSpy).not.toHaveBeenCalled();
    });

    it('should paste a drawing if the target service is initialised', () => {
        const stopDrawingSpy = spyOn(toolHandlerService.getCurrentTool(), 'stopDrawing');
        const updateSpy = spyOn(service['lastSelectionTool'], 'updateSelection');
        service['savedConfigs'] = rectangleSelectionService.config.clone();
        service['isInitialised'] = true;
        service['pasteDrawing']();
        expect(stopDrawingSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('should want to paste if the target service is not initialised', () => {
        const stopDrawingSpy = spyOn(toolHandlerService.getCurrentTool(), 'stopDrawing');
        service['savedConfigs'] = rectangleSelectionService.config.clone();
        service['isInitialised'] = false;
        service['pasteDrawing']();
        expect(stopDrawingSpy).toHaveBeenCalled();
        expect(service['wantsToPaste']).toBeTruthy();
    });
});
