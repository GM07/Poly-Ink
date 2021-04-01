import { TestBed } from '@angular/core/testing';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionResize } from './selection-resize';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('SelectionResize', () => {
    let selectionResize: SelectionResize;
    let selectionConfig: SelectionConfig;
    let canvasSelection: HTMLCanvasElement;
    let mousePosition: Vec2;
    let getNewSizeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasSelection = document.createElement('canvas');
        canvasSelection.width = 2;
        canvasSelection.height = 2;
        selectionConfig = new SelectionConfig();
        selectionResize = new SelectionResize(selectionConfig);
        selectionResize['config'].previewSelectionCtx = canvasSelection.getContext('2d') as CanvasRenderingContext2D;
        selectionResize['memoryCanvas'] = document.createElement('canvas');
        DrawingService.saveCanvas(selectionResize['memoryCanvas'], canvasSelection);
        selectionResize['oppositeSide'] = new Vec2(1, 1);
        mousePosition = new Vec2(0, 0);
        getNewSizeSpy = spyOn<any>(selectionResize, 'getNewSize').and.returnValue(new Vec2(1, 1));
    });

    it('should be created', () => {
        expect(selectionConfig).toBeTruthy();
        expect(selectionResize).toBeTruthy();
    });

    it('should stop drawing', () => {
        selectionResize.stopDrawing();
        expect(selectionResize['memoryCanvas']).toBeUndefined();
    });

    it('should init the attributes', () => {
        selectionResize['initAttribs']();
        expect(selectionResize['memoryCanvas']).toBeUndefined();
    });

    it('should not resize if there are no drawings', () => {
        selectionResize['config'].previewSelectionCtx = null;
        selectionResize.resize(mousePosition);
        expect(getNewSizeSpy).not.toHaveBeenCalled();
    });

    it('should not resize for a width or a height of 0', () => {
        getNewSizeSpy.and.returnValue(new Vec2(0, 0));
        const drawImageSpy = spyOn<any>(selectionResize['config'].previewSelectionCtx, 'drawImage');
        selectionResize.resize(mousePosition);
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('should flip horizontally', () => {
        spyOn<any>(selectionResize, 'shouldFlipHorizontally').and.returnValue(true);
        const flipSpy = spyOn<any>(selectionResize, 'flipHorizontal');
        selectionResize.resize(mousePosition);
        expect(flipSpy).toHaveBeenCalled();
    });

    it('should flip vertically', () => {
        spyOn<any>(selectionResize, 'shouldFlipVertically').and.returnValue(true);
        const flipSpy = spyOn<any>(selectionResize, 'flipVertical');
        selectionResize.resize(mousePosition);
        expect(flipSpy).toHaveBeenCalled();
    });

    it('should determine if it can flip', () => {
        selectionResize['resizeOrigin'] = new Vec2(0, 0);
        mousePosition = new Vec2(2, 2);
        expect(selectionResize['shouldFlipHorizontally'](mousePosition)).toBeTruthy();
        expect(selectionResize['shouldFlipVertically'](mousePosition)).toBeTruthy();
        selectionResize['lockHorizontal'] = true;
        selectionResize['lockVertical'] = true;
        expect(selectionResize['shouldFlipHorizontally'](mousePosition)).toBeFalsy();
        expect(selectionResize['shouldFlipVertically'](mousePosition)).toBeFalsy();
    });

    it('should not flip if there are now drawings', () => {
        const getContextSpy = spyOn<any>(selectionResize['memoryCanvas'], 'getContext');
        selectionResize['config'].previewSelectionCtx = null;
        selectionResize['flipHorizontal']();
        selectionResize['flipVertical']();
        expect(getContextSpy).not.toHaveBeenCalled();
    });

    it('should flip using the right drawing as reference', () => {
        const getContextSpy = spyOn<any>(selectionResize['memoryCanvas'], 'getContext').and.callThrough();
        selectionResize['flipHorizontal']();
        selectionResize['flipVertical']();
        expect(getContextSpy).toHaveBeenCalledTimes(2);
    });

    it('should flip', () => {
        const canvas = selectionResize['memoryCanvas'] as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctx, 'scale');
        selectionResize['flipDrawing'](canvas, new Vec2(0, 0), new Vec2(1, 1));
        expect(ctx.scale).toHaveBeenCalled();
    });

    it('should resize', () => {
        const drawImageSpy = spyOn<any>(selectionResize['config'].previewSelectionCtx, 'drawImage');
        selectionResize.resize(mousePosition);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('should initialise all 8 resize points', () => {
        const initResizeSpy = spyOn<any>(selectionResize, 'initResize');
        const numberOfTimesExpected = 8;
        selectionResize.topLeftResize();
        selectionResize.topMiddleResize();
        selectionResize.topRightResize();
        selectionResize.middleLeftResize();
        selectionResize.middleRightResize();
        selectionResize.bottomLeftResize();
        selectionResize.bottomMiddleResize();
        selectionResize.bottomRightResize();
        expect(initResizeSpy).toHaveBeenCalledTimes(numberOfTimesExpected);
    });

    it('should get no translation for the locked resize direction', () => {
        selectionResize['lockVertical'] = true;
        selectionResize['lockHorizontal'] = true;
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual(new Vec2(0, 0));
    });

    it('should get the appropriate translation required to do a resize, when going over the maximum alowed', () => {
        // tslint:disable-next-line:no-magic-numbers
        spyOn<any>(selectionResize, 'getTranslation').and.returnValue(new Vec2(10, 10));
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual(new Vec2(0, 0));
    });

    it('should get the appropriate translation required to do a resize, when first needing one', () => {
        // tslint:disable-next-line:no-magic-numbers
        spyOn<any>(selectionResize, 'getTranslation').and.returnValue(new Vec2(10, 10));
        selectionResize['resizeOrigin'] = new Vec2(2, 2);
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual(new Vec2(0, 0));
    });

    it('should not modify the translation for a resize if it is not needed', () => {
        selectionResize['resizeOrigin'] = new Vec2(2, 2);
        mousePosition = new Vec2(2, 2);
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual(new Vec2(0, 0));
    });

    it('should initialize the memory canvas only if it was undefined before', () => {
        spyOn(DrawingService, 'saveCanvas');
        selectionResize['initResize'](new Vec2(0, 0), new Vec2(0, 0));
        expect(DrawingService.saveCanvas).not.toHaveBeenCalled();
        selectionResize['memoryCanvas'] = undefined;
        selectionResize['initResize'](new Vec2(0, 0), new Vec2(0, 0));
        expect(DrawingService.saveCanvas).toHaveBeenCalled();
    });

    it('should not initialise if there are no drawings', () => {
        spyOn(DrawingService, 'saveCanvas');
        selectionResize['config'].previewSelectionCtx = null;
        selectionResize['memoryCanvas'] = undefined;
        selectionResize['initResize'](new Vec2(0, 0), new Vec2(0, 0));
        expect(DrawingService.saveCanvas).not.toHaveBeenCalled();
    });

    it('should get the translation', () => {
        mousePosition = new Vec2(2, 2);
        selectionResize['resizeOrigin'] = new Vec2(1, 1);
        expect(selectionResize['getTranslation'](mousePosition)).toEqual(new Vec2(1, 1));
    });

    it('should get the new size', () => {
        getNewSizeSpy.and.callThrough();
        mousePosition = new Vec2(2, 2);
        selectionResize['oppositeSide'] = new Vec2(1, 1);
        expect(selectionResize['getNewSize'](mousePosition)).toEqual(new Vec2(1, 1));
    });

    it('should not get the new size if the resize is locked', () => {
        getNewSizeSpy.and.callThrough();
        selectionResize['lockHorizontal'] = true;
        selectionResize['lockVertical'] = true;
        const expectedResize = new Vec2(selectionResize['config'].width, selectionResize['config'].height);
        expect(selectionResize['getNewSize'](mousePosition)).toEqual(expectedResize);
    });

    it('should adapt the mouse position', () => {
        selectionResize['config'].shift.isDown = false;
        expect(selectionResize['adaptMousePosition'](mousePosition)).toEqual(mousePosition);
        selectionResize['config'].shift.isDown = true;
        mousePosition = new Vec2(1, 2);
        expect(selectionResize['adaptMousePosition'](mousePosition)).toEqual(new Vec2(1, 1));
    });
});
