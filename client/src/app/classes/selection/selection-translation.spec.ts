import { TestBed } from '@angular/core/testing';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/drawing/grid.service';
import { MagnetismService } from '@app/services/drawing/magnetism.service';
import { SelectionTranslation } from './selection-translation';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('SelectionTranslation', () => {
    let selectionTranslation: SelectionTranslation;
    let selectionConfig: SelectionConfig;
    let canvasSelection: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasSelection = document.createElement('canvas');
        selectionConfig = new SelectionConfig();
        selectionTranslation = new SelectionTranslation(selectionConfig, new MagnetismService(new GridService()));
        selectionTranslation['isMouseTranslationStarted'] = true;
    });

    it('should be created', () => {
        expect(selectionConfig).toBeTruthy();
        expect(selectionTranslation).toBeTruthy();
    });

    it('get translation should return the current translation', () => {
        // tslint:disable-next-line:no-magic-numbers
        const mousePos = new Vec2(25, 25);
        // tslint:disable-next-line:no-magic-numbers
        selectionTranslation['translationOrigin'] = new Vec2(25, 25);
        expect(selectionTranslation['getTranslation'](mousePos)).toEqual(new Vec2(0, 0));
    });

    it('set ArrowKeyUp should update the keys when down', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'arrowleft' });
        const keyboardEventRight = new KeyboardEvent('keydown', { key: 'arrowright' });
        const keyboardEventDown = new KeyboardEvent('keydown', { key: 'arrowdown' });
        const keyboardEventUp = new KeyboardEvent('keydown', { key: 'arrowup' });
        selectionTranslation['setArrowKeyDown'](keyboardEventLeft);
        selectionTranslation['setArrowKeyDown'](keyboardEventRight);
        selectionTranslation['setArrowKeyDown'](keyboardEventUp);
        selectionTranslation['setArrowKeyDown'](keyboardEventDown);
        expect(selectionTranslation['LEFT_ARROW'].isDown).toBeTruthy();
        expect(selectionTranslation['RIGHT_ARROW'].isDown).toBeTruthy();
        expect(selectionTranslation['DOWN_ARROW'].isDown).toBeTruthy();
        expect(selectionTranslation['UP_ARROW'].isDown).toBeTruthy();
    });

    it('set ArrowKeyUp should update the keys when not down', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        selectionTranslation['setArrowKeyDown'](keyboardEventLeft);
        expect(selectionTranslation['LEFT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['DOWN_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['UP_ARROW'].isDown).toBeFalsy();
    });

    it('set arrowKeyDown should update the keys when up', () => {
        selectionTranslation['LEFT_ARROW'].isDown = true;
        selectionTranslation['RIGHT_ARROW'].isDown = true;
        selectionTranslation['DOWN_ARROW'].isDown = true;
        selectionTranslation['UP_ARROW'].isDown = true;
        const keyboardEventLeft = new KeyboardEvent('keyup', { key: 'arrowleft' });
        const keyboardEventRight = new KeyboardEvent('keyup', { key: 'arrowright' });
        const keyboardEventDown = new KeyboardEvent('keyup', { key: 'arrowdown' });
        const keyboardEventUp = new KeyboardEvent('keyup', { key: 'arrowup' });
        selectionTranslation['setArrowKeyUp'](keyboardEventLeft);
        selectionTranslation['setArrowKeyUp'](keyboardEventRight);
        selectionTranslation['setArrowKeyUp'](keyboardEventUp);
        selectionTranslation['setArrowKeyUp'](keyboardEventDown);
        expect(selectionTranslation['LEFT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['DOWN_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['UP_ARROW'].isDown).toBeFalsy();
    });

    it('set ArrowKeyDown should update the keys when not up', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        selectionTranslation['setArrowKeyUp'](keyboardEventLeft);
        expect(selectionTranslation['LEFT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['DOWN_ARROW'].isDown).toBeFalsy();
        expect(selectionTranslation['UP_ARROW'].isDown).toBeFalsy();
    });

    it('HorizontalTranslationModifier should return 3 if right Arrow is down', () => {
        selectionTranslation['RIGHT_ARROW'].isDown = true;
        expect(selectionTranslation['HorizontalTranslationModifier']()).toEqual(selectionTranslation['TRANSLATION_PIXELS']);
    });

    it('HorizontalTranslationModifier should return -3 if left Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        selectionTranslation['RIGHT_ARROW'].isDown = false;
        selectionTranslation['LEFT_ARROW'].isDown = true;
        expect(selectionTranslation['HorizontalTranslationModifier']()).toEqual(-selectionTranslation['TRANSLATION_PIXELS']);
    });

    it('VerticalTranslationModifier should return 3 if down Arrow is down', () => {
        selectionTranslation['DOWN_ARROW'].isDown = true;
        expect(selectionTranslation['VerticalTranslationModifier']()).toEqual(3);
    });

    it('VerticalTranslationModifier should return -3 if up Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        selectionTranslation['UP_ARROW'].isDown = true;
        expect(selectionTranslation['VerticalTranslationModifier']()).toEqual(-3);
    });

    it('selection should not move with different keys than arrow', () => {
        spyOn<any>(selectionTranslation, 'UPDATE_SELECTION_REQUEST');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        expect(selectionTranslation['UPDATE_SELECTION_REQUEST']).not.toHaveBeenCalled();
    });

    it('should do nothing on event repeat', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowleft', repeat: true });
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        spyOn<any>(selectionTranslation, 'UPDATE_SELECTION_REQUEST');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        expect(selectionTranslation['UPDATE_SELECTION_REQUEST']).not.toHaveBeenCalled();
    });

    it('should not stop moving the selection if we release a different key than an arrow', () => {
        selectionTranslation['LEFT_ARROW'].isDown = true;
        const keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        spyOn(window, 'clearInterval');
        selectionTranslation.onKeyUp(keyboardEventUp);
        expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('should indicate if an arrow key is down', () => {
        expect(selectionTranslation['isArrowKeyDown'](new KeyboardEvent('keyup', { key: 'arrowleft' }), false)).toBeTruthy();
    });

    it('should clear the translation interval for the arrow keys', () => {
        selectionTranslation['clearArrowKeys']();
        expect(selectionTranslation['moveId']).toEqual(selectionTranslation['DEFAULT_MOVE_ID']);
    });

    it('should send an update selection request', () => {
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        selectionTranslation['sendUpdateSelectionRequest'](new Vec2(0, 0));
        expect(updateSelection).toHaveBeenCalled();
    });

    it('it should move the selection when there is a selection and an arrow is pressed', () => {
        jasmine.clock().install();
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'HorizontalTranslationModifier').and.returnValue(1);
        spyOn<any>(selectionTranslation, 'VerticalTranslationModifier').and.returnValue(1);
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        jasmine.clock().tick(600);
        expect(updateSelection).toHaveBeenCalled();
        expect(updateSelection).toHaveBeenCalledTimes(2);
        jasmine.clock().uninstall();
        window.clearInterval(selectionTranslation['moveId']);
    });

    it('should not move the selection multiple times if the key was pressed multiple times', () => {
        jasmine.clock().install();
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        jasmine.clock().tick(200);
        selectionTranslation['moveId'] = 1;
        jasmine.clock().tick(350);
        expect(updateSelection).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    });

    it('should not move the selection if it is already moving', () => {
        jasmine.clock().install();
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation['moveId'] = 1;
        selectionTranslation.onKeyDown(keyboardEvent, false);
        jasmine.clock().tick(500);
        expect(updateSelection).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    });

    it('should update the selection on mouse move if the selection is not null', () => {
        selectionTranslation['config'].previewSelectionCtx = null;
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'getTranslation').and.returnValue(new Vec2(0, 0));
        const radix = 10;
        selectionTranslation['config'].width = parseInt(document.body.style.width, radix) - 1;
        selectionTranslation['config'].height = parseInt(document.body.style.height, radix) - 1;
        selectionTranslation.onMouseMove({ pageX: 1, pageY: 1 } as MouseEvent, new Vec2(1, 1));
        expect(updateSelection).not.toHaveBeenCalled();
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onMouseMove({ pageX: 1, pageY: 1 } as MouseEvent, new Vec2(1, 1));
        expect(updateSelection).toHaveBeenCalled();
    });

    it('on mouse up should move selection if canvas is set', () => {
        selectionTranslation['config'].previewSelectionCtx = null;
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'getTranslation');
        selectionTranslation.onMouseUp(new Vec2(0, 0));
        expect(updateSelection).not.toHaveBeenCalled();
        selectionTranslation['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onMouseUp(new Vec2(0, 0));
        expect(updateSelection).toHaveBeenCalled();
    });

    it('horizontal translation modifier should use magnetism if enabled', () => {
        selectionTranslation['magnetismService'].isEnabled = true;
        spyOn(selectionTranslation['magnetismService'], 'getXKeyAdjustment');
        selectionTranslation['HorizontalTranslationModifier']();
        expect(selectionTranslation['magnetismService'].getXKeyAdjustment).toHaveBeenCalled();
    });

    it('vertical translation modifier should use magnetism if enabled', () => {
        selectionTranslation['magnetismService'].isEnabled = true;
        spyOn(selectionTranslation['magnetismService'], 'getYKeyAdjustment');
        selectionTranslation['VerticalTranslationModifier']();
        expect(selectionTranslation['magnetismService'].getYKeyAdjustment).toHaveBeenCalled();
    });
});
