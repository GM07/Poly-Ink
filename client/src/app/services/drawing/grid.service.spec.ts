import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        service.canvas = document.createElement('canvas');
        service.ctx = service.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('upsizegrid should add 5 to the size of the grid', () => {
        service.size = ToolSettingsConst.GRID_MIN_SIZE;
        service.upsizeGrid();
        expect(service.size).toEqual(ToolSettingsConst.GRID_MIN_SIZE + ToolSettingsConst.GRID_STEP);
    });

    it('downsizegrid should remove 5 to the size of the grid', () => {
        service.size = ToolSettingsConst.GRID_MIN_SIZE + ToolSettingsConst.GRID_STEP;
        service.downsizeGrid();
        expect(service.size).toEqual(ToolSettingsConst.GRID_MIN_SIZE);
    });

    it('get and set opacity should get and set the opacity', () => {
        spyOn(service, 'updateGrid');
        service.opacityValue = ToolSettingsConst.GRID_MAX_OPACITY;
        expect(service.opacityValue).toEqual(ToolSettingsConst.GRID_MAX_OPACITY);
    });

    it('get and set size should get and set the size', () => {
        spyOn(service, 'updateGrid');
        service.sizeValue = ToolSettingsConst.GRID_MIN_SIZE;
        expect(service.sizeValue).toEqual(ToolSettingsConst.GRID_MIN_SIZE);
    });

    it('updateGrid should draw lines', () => {
        service.canvas = document.createElement('canvas');
        service.ctx = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.canvas.width = ToolSettingsConst.GRID_MIN_SIZE;
        service.canvas.height = ToolSettingsConst.GRID_MIN_SIZE;
        spyOn(service, 'drawLine');
        service.updateGrid();
        expect(service.drawLine).toHaveBeenCalled();
    });

    it('drawLine should draw a line between begin and end', () => {
        service.canvas = document.createElement('canvas');
        service.ctx = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.canvas.width = ToolSettingsConst.GRID_MIN_SIZE;
        service.canvas.height = ToolSettingsConst.GRID_MIN_SIZE;
        spyOn(service.ctx, 'moveTo');
        spyOn(service.ctx, 'lineTo');
        spyOn(service.ctx, 'stroke');
        service.drawLine(new Vec2(0, 0), new Vec2(ToolSettingsConst.GRID_STEP, ToolSettingsConst.GRID_STEP));
        expect(service.ctx.moveTo).toHaveBeenCalled();
        expect(service.ctx.lineTo).toHaveBeenCalled();
        expect(service.ctx.stroke).toHaveBeenCalled();
    });

    it('should toggle the grid on key down with g', () => {
        const event = { key: 'g', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
        const gridVisibility = service.gridVisibility;
        service.onKeyDown(event);
        expect(service.gridVisibility).not.toEqual(gridVisibility);
        service.onKeyDown(event);
        expect(service.gridVisibility).toEqual(gridVisibility);
    });

    it('should upsize the grid on key down with =', () => {
        const event = { key: '=', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
        spyOn(service, 'updateGrid');
        spyOn(service, 'upsizeGrid');
        spyOn(service.ctx, 'clearRect');
        service.onKeyDown(event);
        expect(service.updateGrid).toHaveBeenCalled();
        expect(service.upsizeGrid).toHaveBeenCalled();
    });

    it('should downsize the grid on key down with -', () => {
        const event = { key: '-', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
        spyOn(service, 'updateGrid');
        spyOn(service, 'downsizeGrid');
        spyOn(service.ctx, 'clearRect');
        service.onKeyDown(event);
        expect(service.updateGrid).toHaveBeenCalled();
        expect(service.downsizeGrid).toHaveBeenCalled();
    });

    it('should do nothing on other key', () => {
        const event = { key: '_', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
        spyOn(service, 'updateGrid');
        spyOn(service, 'downsizeGrid');
        spyOn(service, 'upsizeGrid');
        service.onKeyDown(event);
        expect(service.updateGrid).not.toHaveBeenCalled();
        expect(service.downsizeGrid).not.toHaveBeenCalled();
        expect(service.upsizeGrid).not.toHaveBeenCalled();
    });
});
