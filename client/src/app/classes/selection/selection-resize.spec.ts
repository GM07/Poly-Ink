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
        selectionResize['config'].selectionCtx = canvasSelection.getContext('2d') as CanvasRenderingContext2D;
        selectionResize['memoryCanvas'] = document.createElement('canvas');
        DrawingService.saveCanvas(selectionResize['memoryCanvas'], canvasSelection);
        selectionResize['oppositeSide'] = { x: 1, y: 1 } as Vec2;
        mousePosition = { x: 0, y: 0 } as Vec2;
        getNewSizeSpy = spyOn<any>(selectionResize, 'getNewSize').and.returnValue({ x: 1, y: 1 } as Vec2);
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
        selectionResize['config'].selectionCtx = null;
        selectionResize.resize(mousePosition);
        expect(getNewSizeSpy).not.toHaveBeenCalled();
    });

    it('should not resize for a width or a height of 0', () => {
        getNewSizeSpy.and.returnValue({ x: 0, y: 0 } as Vec2);
        const drawImageSpy = spyOn<any>(selectionResize['config'].selectionCtx, 'drawImage');
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
        selectionResize['resizeOrigin'] = { x: 0, y: 0 } as Vec2;
        mousePosition = { x: 2, y: 2 } as Vec2;
        expect(selectionResize['shouldFlipHorizontally'](mousePosition)).toBeTruthy();
        expect(selectionResize['shouldFlipVertically'](mousePosition)).toBeTruthy();
        selectionResize['lockHorizontal'] = true;
        selectionResize['lockVertical'] = true;
        expect(selectionResize['shouldFlipHorizontally'](mousePosition)).toBeFalsy();
        expect(selectionResize['shouldFlipVertically'](mousePosition)).toBeFalsy();
    });

    it('should not flip if there are now drawings', () => {
        const getContextSpy = spyOn<any>(selectionResize['memoryCanvas'], 'getContext');
        selectionResize['config'].selectionCtx = null;
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

    it('should resize', () => {
        const drawImageSpy = spyOn<any>(selectionResize['config'].selectionCtx, 'drawImage');
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
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should get the appropriate translation required to do a resize, when going over the maximum alowed', () => {
        spyOn<any>(selectionResize, 'getTranslation').and.returnValue({ x: 10, y: 10 } as Vec2);
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should get the appropriate translation required to do a resize, when first needing one', () => {
        spyOn<any>(selectionResize, 'getTranslation').and.returnValue({ x: 10, y: 10 } as Vec2);
        selectionResize['resizeOrigin'] = { x: 2, y: 2 } as Vec2;
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should not modify the translation for a resize if it is not needed', () => {
        selectionResize['resizeOrigin'] = { x: 2, y: 2 } as Vec2;
        mousePosition = { x: 2, y: 2 } as Vec2;
        expect(selectionResize['getTranslationForResize'](mousePosition)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should initialize the memory canvas only if it was undefined before', () => {
        spyOn(DrawingService, 'saveCanvas');
        selectionResize['initResize']({ x: 0, y: 0 } as Vec2, { x: 0, y: 0 } as Vec2);
        expect(DrawingService.saveCanvas).not.toHaveBeenCalled();
        selectionResize['memoryCanvas'] = undefined;
        selectionResize['initResize']({ x: 0, y: 0 } as Vec2, { x: 0, y: 0 } as Vec2);
        expect(DrawingService.saveCanvas).toHaveBeenCalled();
    });

    it('should not initialise if there are no drawings', () => {
        spyOn(DrawingService, 'saveCanvas');
        selectionResize['config'].selectionCtx = null;
        selectionResize['memoryCanvas'] = undefined;
        selectionResize['initResize']({ x: 0, y: 0 } as Vec2, { x: 0, y: 0 } as Vec2);
        expect(DrawingService.saveCanvas).not.toHaveBeenCalled();
    });

    it('should get the translation', () => {
        mousePosition = { x: 2, y: 2 } as Vec2;
        selectionResize['resizeOrigin'] = { x: 1, y: 1 } as Vec2;
        expect(selectionResize['getTranslation'](mousePosition)).toEqual({ x: 1, y: 1 } as Vec2);
    });

    it('should get the new size', () => {
        getNewSizeSpy.and.callThrough();
        mousePosition = { x: 2, y: 2 } as Vec2;
        selectionResize['oppositeSide'] = { x: 1, y: 1 } as Vec2;
        expect(selectionResize['getNewSize'](mousePosition)).toEqual({ x: 1, y: 1 } as Vec2);
    });

    it('should not get the new size if the resize is locked', () => {
        getNewSizeSpy.and.callThrough();
        selectionResize['lockHorizontal'] = true;
        selectionResize['lockVertical'] = true;
        expect(selectionResize['getNewSize'](mousePosition)).toEqual({
            x: selectionResize['config'].width,
            y: selectionResize['config'].height,
        } as Vec2);
    });

    it('should adapt the mouse position', () => {
        selectionResize['config'].shift.isDown = false;
        expect(selectionResize['adaptMousePosition'](mousePosition)).toEqual(mousePosition);
        selectionResize['config'].shift.isDown = true;
        mousePosition = { x: 1, y: 2 };
        expect(selectionResize['adaptMousePosition'](mousePosition)).toEqual({ x: 1, y: 1 } as Vec2);
    });
});
