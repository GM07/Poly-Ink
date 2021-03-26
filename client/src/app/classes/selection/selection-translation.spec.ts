import { TestBed } from '@angular/core/testing';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
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
        selectionTranslation = new SelectionTranslation(selectionConfig);
    });

    it('get translation should return the current translation', () => {
        const mousePos = { x: 25, y: 25 } as Vec2;
        selectionTranslation['translationOrigin'] = { x: 25, y: 25 } as Vec2;
        expect(selectionTranslation['getTranslation'](mousePos)).toEqual({ x: 0, y: 0 } as Vec2);
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

    it('HorizontalTranslationModifier should return 1 if right Arrow is down', () => {
        selectionTranslation['RIGHT_ARROW'].isDown = true;
        expect(selectionTranslation['HorizontalTranslationModifier']()).toEqual(1);
    });

    it('HorizontalTranslationModifier should return -1 if left Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        selectionTranslation['RIGHT_ARROW'].isDown = false;
        selectionTranslation['LEFT_ARROW'].isDown = true;
        expect(selectionTranslation['HorizontalTranslationModifier']()).toEqual(-1);
    });

    it('VerticalTranslationModifier should return 1 if down Arrow is down', () => {
        selectionTranslation['DOWN_ARROW'].isDown = true;
        expect(selectionTranslation['VerticalTranslationModifier']()).toEqual(1);
    });

    it('VerticalTranslationModifier should return -1 if up Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        selectionTranslation['UP_ARROW'].isDown = true;
        expect(selectionTranslation['VerticalTranslationModifier']()).toEqual(-1);
    });

    it('selection should not move with different keys than arrow', () => {
        spyOn<any>(selectionTranslation, 'updateSelectionRequest');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        expect(selectionTranslation['updateSelectionRequest']).not.toHaveBeenCalled();
    });

    it('should do nothing on event repeat', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowleft', repeat: true });
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
        spyOn<any>(selectionTranslation, 'updateSelectionRequest');
        selectionTranslation.onKeyDown(keyboardEvent, false);
        expect(selectionTranslation['updateSelectionRequest']).not.toHaveBeenCalled();
    });

    it('should not stop moving the selection if we release a different key than an arrow', () => {
        selectionTranslation['LEFT_ARROW'].isDown = true;
        const keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
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

    it('it should move the selection when there is a selection and an arrow is pressed', () => {
        jasmine.clock().install();
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'HorizontalTranslationModifier').and.returnValue(1);
        spyOn<any>(selectionTranslation, 'VerticalTranslationModifier').and.returnValue(1);
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
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
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
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
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
        selectionTranslation['moveId'] = 1;
        selectionTranslation.onKeyDown(keyboardEvent, false);
        jasmine.clock().tick(500);
        expect(updateSelection).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    });

    it('should update the selection on mouse move if the selection is not null', () => {
        selectionTranslation['config'].selectionCtx = null;
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'getTranslation');
        selectionTranslation.onMouseMove({ pageX: 1, pageY: 1 } as MouseEvent, { x: 1, y: 1 } as Vec2);
        expect(updateSelection).not.toHaveBeenCalled();
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onMouseMove({ pageX: 1, pageY: 1 } as MouseEvent, { x: 1, y: 1 } as Vec2);
        expect(updateSelection).toHaveBeenCalled();
    });

    it('on mouse up should move selection if canvas is set', () => {
        selectionTranslation['config'].selectionCtx = null;
        const updateSelection = spyOn<any>(selectionTranslation, 'sendUpdateSelectionRequest');
        spyOn<any>(selectionTranslation, 'getTranslation');
        selectionTranslation.onMouseUp(new Vec2(0, 0));
        expect(updateSelection).not.toHaveBeenCalled();
        selectionTranslation['config'].selectionCtx = canvasSelection.getContext('2d');
        selectionTranslation.onMouseUp(new Vec2(0, 0));
        expect(updateSelection).toHaveBeenCalled();
    });
});
