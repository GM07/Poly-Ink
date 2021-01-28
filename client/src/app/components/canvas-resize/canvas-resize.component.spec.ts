import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { CanvasConst } from '@app/constants/canvas.ts';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasResizeComponent } from './canvas-resize.component';

describe('CanvasResizeComponent', () => {
    let component: CanvasResizeComponent;
    let fixture: ComponentFixture<CanvasResizeComponent>;
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(async(() => {
        service = new DrawingService();
        TestBed.configureTestingModule({
            declarations: [CanvasResizeComponent, DrawingComponent],
            providers: [{ provide: DrawingService, useValue: service }],
        }).compileComponents();
    }));

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.previewCanvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(DrawingService);

        fixture = TestBed.createComponent(CanvasResizeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const dragAndDrop = (beginX: number, beginY: number, endX: number, endY: number): void => {
        const downEvent = new MouseEvent('document:mouseDown', { clientX: beginX, clientY: beginY });
        const moveEvent = new MouseEvent('document:mouseMove', { clientX: endX, clientY: endY });
        const upEvent = new MouseEvent('document:mouseUp', { clientX: endX, clientY: endY });
        component.onMouseDown(downEvent);
        component.onMouseMove(moveEvent);
        component.onMouseUp(upEvent);
    };

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not be smaller than 250px', () => {
        component.resizeCanvas(CanvasConst.MIN_WIDTH - 1, CanvasConst.MIN_HEIGHT - 1);
        expect(service.canvas.width).toEqual(CanvasConst.MIN_WIDTH);
        expect(service.canvas.height).toEqual(CanvasConst.MIN_HEIGHT);
    });

    it('preview canvas should be equal to canvas', () => {
        component.resizeCanvas(CanvasConst.MIN_WIDTH + 1, CanvasConst.MIN_HEIGHT + 1);
        expect(service.canvas.width).toEqual(service.previewCanvas.width);
        expect(service.canvas.height).toEqual(service.previewCanvas.height);
    });

    it('should draw white pixels', () => {
        component.resizeCanvas(CanvasConst.MIN_WIDTH + 1, CanvasConst.MIN_HEIGHT + 1);
        const pixelBuffer = service.baseCtx.getImageData(CanvasConst.MIN_WIDTH, CanvasConst.MIN_HEIGHT, 1, 1).data;
        const stringPixelBuffer = String(pixelBuffer[0]) + String(pixelBuffer[1]) + String(pixelBuffer[2]);
        expect(stringPixelBuffer).toBe('255255255'); // Représente un pixel avec le rvb à 255
    });

    it('should resize when dragging the bottom side', () => {
        const xPos = component.getCanvasLeft();
        const yPos = service.canvas.height + component.getCanvasTop() + 2; // Petite valeurs pour simuler un clic
        dragAndDrop(xPos, yPos, xPos + CanvasConst.SHIFTING, yPos + CanvasConst.SHIFTING);
        expect(service.canvas.height).toBe(yPos - component.getCanvasTop() + CanvasConst.SHIFTING);
    });

    it('should resize when dragging the right side', () => {
        const xPos = service.canvas.width + component.getCanvasLeft() + 2;
        const yPos = component.getCanvasTop();
        dragAndDrop(xPos, yPos, xPos + CanvasConst.SHIFTING, yPos + CanvasConst.SHIFTING);
        expect(service.canvas.width).toBe(xPos - component.getCanvasLeft() + CanvasConst.SHIFTING);
    });

    it('should resize when dragging the corner', () => {
        const xPos = service.canvas.width + component.getCanvasLeft() - 1;
        const yPos = service.canvas.height + component.getCanvasTop() + 1; // Petite valeurs pour simuler un clic
        dragAndDrop(xPos, yPos, 0, 0);
        expect(service.canvas.width).toBe(CanvasConst.MIN_WIDTH);
        expect(service.canvas.height).toBe(CanvasConst.MIN_HEIGHT);
    });

    it('should not resize when clicking elsewhere', () => {
        const canvasWidth = service.canvas.width;
        const canvasHeight = service.canvas.height;
        dragAndDrop(0, 0, 0, 0);
        expect(canvasWidth).toBe(service.canvas.width);
        expect(canvasHeight).toBe(service.canvas.height);
    });

    it('should not drag with other click', () => {
        const downEvent = new MouseEvent('document:mouseDown', { button: 1 });
        const mouseEventSpy = spyOn(component, 'onMouseDown').and.callThrough();
        component.onMouseDown(downEvent);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(downEvent);
    });
});
