import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { StampService } from './stamp.service';

// tslint:disable:no-string-literal

describe('StampService', () => {
    let service: StampService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('set scale should set the scale', () => {
        const newScale = 4;
        const currentScale = service.config.scale;
        service.scaleValue = newScale;
        expect(currentScale).not.toEqual(service.config.scale);
        expect(service.config.scale).toEqual(newScale);
    });

    it('set scale should not allow out of bound', () => {
        const invalidMinScale = -1;
        const invalidMaxScale = 10;
        service.scaleValue = invalidMinScale;
        expect(service.config.scale).toEqual(ToolSettingsConst.STAMP_MIN_VALUE);
        service.scaleValue = invalidMaxScale;
        expect(service.config.scale).toEqual(ToolSettingsConst.STAMP_MAX_VALUE);
    });

    it('set angle should set the angle', () => {
        const currentAngle = service.config.angle;
        service.angleValue = ToolMath.DEGREE_CONVERSION_FACTOR;
        expect(currentAngle).not.toEqual(service.config.angle);
        expect(service.angleValue).toEqual(ToolMath.DEGREE_CONVERSION_FACTOR);
    });

    it('set angle should not allow out of bound', () => {
        const invalidMinAngle = -1;
        const invalidMaxAngle = 10000;
        service.angleValue = invalidMinAngle;
        expect(service.config.angle).toEqual(0);
        service.angleValue = invalidMaxAngle;
        expect(service.config.angle).toEqual(ToolSettingsConst.STAMP_MAX_ANGLE);
    });

    it('is active should return true if the cursor is none', () => {
        service['drawingService'].previewCanvas = document.createElement('canvas');
        service['drawingService'].previewCanvas.style.cursor = 'none';
        expect(service.isActive()).toEqual(true);
        service['drawingService'].previewCanvas.style.cursor = 'pointer';
        expect(service.isActive()).toEqual(false);
    });

    it('stop drawing should reset the cursor and the preview', () => {
        service['drawingService'].previewCanvas = document.createElement('canvas');
        service['drawingService'].previewCanvas.style.cursor = 'none';
        spyOn(service['drawingService'], 'clearCanvas');
        service.stopDrawing();
        expect(service['drawingService'].previewCanvas.style.cursor).toEqual('crosshair');
        expect(service['drawingService'].clearCanvas).toHaveBeenCalled();
    });

    it('on mouse move should update preview inside of canvas', () => {
        service['drawingService'].previewCanvas = document.createElement('canvas');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        spyOn(service, 'getPositionFromMouse').and.returnValue(new Vec2(0, 0));
        spyOn(service, 'drawPreview');
        service.onMouseMove({} as MouseEvent);
        expect(service.drawPreview).toHaveBeenCalled();
    });

    it('on mouse move should update preview outside of canvas', () => {
        service['drawingService'].previewCanvas = document.createElement('canvas');
        spyOn(service, 'isInCanvas').and.returnValue(false);
        spyOn(service, 'getPositionFromMouse').and.returnValue(new Vec2(0, 0));
        spyOn(service, 'drawPreview');
        service.onMouseMove({} as MouseEvent);
        expect(service.drawPreview).toHaveBeenCalled();
    });

    it('onMouseDown should draw on left click', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue(new Vec2(0, 0));
        spyOn(service, 'draw');
        service.onMouseDown({ button: 0 } as MouseEvent);
        expect(service.draw).toHaveBeenCalled();
    });

    it('onMouseDown should not draw on other click', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue(new Vec2(0, 0));
        spyOn(service, 'draw');
        service.onMouseDown({ button: 2 } as MouseEvent);
        expect(service.draw).not.toHaveBeenCalled();
    });

    it('onKeyDown should set alt key if correct key', () => {
        service.onKeyDown({ key: 'Alt', altKey: true } as KeyboardEvent);
        expect(service.alt.isDown).toEqual(true);
    });

    it('onKeyDown should not set alt key if incorrect key', () => {
        service.alt.isDown = true;
        service.onKeyDown({ key: 'Shift', altKey: false } as KeyboardEvent);
        expect(service.alt.isDown).toEqual(true);
    });

    it('onKeyUp should update alt key if correct key', () => {
        service.onKeyDown({ key: 'Alt', altKey: true } as KeyboardEvent);
        service.onKeyUp({ key: 'Alt', altKey: false } as KeyboardEvent);
        expect(service.alt.isDown).toEqual(false);
    });

    it('onKeyUp should not update alt key if incorrect key', () => {
        service.alt.isDown = false;
        service.onKeyUp({ key: 'Shift', altKey: true } as KeyboardEvent);
        expect(service.alt.isDown).toEqual(false);
    });

    it('draw should call draw from drawingService', () => {
        spyOn(service.config, 'clone');
        spyOn(service['drawingService'], 'draw');
        service.draw();
        expect(service['drawingService'].draw).toHaveBeenCalled();
    });

    it('drawPreview should call passDrawPreview from drawingService', () => {
        spyOn(service.config, 'clone');
        spyOn(service['drawingService'], 'passDrawPreview');
        service.drawPreview();
        expect(service['drawingService'].passDrawPreview).toHaveBeenCalled();
    });
});
