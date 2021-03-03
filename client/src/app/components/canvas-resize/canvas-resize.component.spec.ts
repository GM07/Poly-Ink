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

    const dragAndDrop = (right: boolean, bottom: boolean, endX: number, endY: number): void => {
        const moveEvent = new MouseEvent('document:mouseMove', { clientX: endX, clientY: endY });
        const upEvent = new MouseEvent('document:mouseUp', { clientX: endX, clientY: endY });
        component.mouseDown(right, bottom);
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
        expect(stringPixelBuffer).toBe('255255255'); // Is a pixel with rgb set to 255
    });

    it('should resize when dragging the bottom side', () => {
        const xPos = component.getCanvasLeft();
        const yPos = service.canvas.height + Math.ceil(component.getCanvasTop());
        dragAndDrop(false, true, xPos + CanvasConst.SHIFTING, yPos + CanvasConst.SHIFTING);
        expect(service.canvas.height).toBe(yPos - Math.ceil(component.getCanvasTop()) + CanvasConst.SHIFTING);
    });

    it('should resize when dragging the right side', () => {
        const xPos = service.canvas.width + component.getCanvasLeft();
        const yPos = component.getCanvasTop();
        dragAndDrop(true, false, xPos + CanvasConst.SHIFTING, yPos + CanvasConst.SHIFTING);
        expect(service.canvas.width).toBe(xPos - component.getCanvasLeft() + CanvasConst.SHIFTING);
    });

    it('should resize when dragging the corner', () => {
        dragAndDrop(true, true, 0, 0);
        expect(service.canvas.width).toBe(CanvasConst.MIN_WIDTH);
        expect(service.canvas.height).toBe(CanvasConst.MIN_HEIGHT);
    });

    it('should not resize when clicking elsewhere', () => {
        const canvasWidth = service.canvas.width;
        const canvasHeight = service.canvas.height;
        dragAndDrop(false, false, 0, 0);
        expect(canvasWidth).toBe(service.canvas.width);
        expect(canvasHeight).toBe(service.canvas.height);
    });

    it('should not do anything when moving but not clicking', () => {
        const moveEvent = new MouseEvent('mouseMove', {});
        const mouseEventSpy = spyOn(component, 'onMouseMove').and.callThrough();
        component.onMouseMove(moveEvent);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(moveEvent);
    });

    it('should handle null error', () => {
        spyOn(window, 'alert');
        const elem = {
            getContext(contextId: '2d', options?: CanvasRenderingContext2DSettings | undefined): CanvasRenderingContext2D | null {
                return null;
            },
        } as HTMLCanvasElement;
        // tslint:disable:no-string-literal
        service['saveCanvas'](elem);
        expect(window.alert).toHaveBeenCalledWith('Error when resizing');
    });
    it('mouseDownShould should set previewResizeView to true', () => {
        component.mouseDown(true, false);
        expect(component.previewResizeView).toBe(true);
    });

    it('set canvasMargin should set value of canvasTop and canvasLeft', () => {
        // tslint:disable:no-string-literal
        component['setCanvasMargin']();
        const canvasTop = component.getCanvasTop();
        const canvasLeft = component.getCanvasLeft();
        expect(canvasTop).toBeDefined();
        expect(canvasLeft).toBeDefined();
    });

    it('resize canvas should propagate to drawingService', () => {
        const randomFormat = 100;
        const spyFunc = spyOn(service, 'resizeCanvas');
        component.resizeCanvas(randomFormat, randomFormat);
        expect(spyFunc).toHaveBeenCalled();
    });

    it('setStyleControl should change value of control css', () => {
        // tslint:disable:no-string-literal
        component['setStyleControl']();
        expect(component.controlRightStyle['margin-left']).toBeDefined();
        expect(component.controlBottomStyle['margin-left']).toBeDefined();
        expect(component.controlCornerStyle['margin-left']).toBeDefined();
    });

    it('setStylePreview should change value of preview css', () => {
        // tslint:disable:no-string-literal
        component['setStylePreview']();
        expect(component.previewResizeStyle.width).toBeDefined();
        expect(component.workZoneStyle.width).toBeDefined();
    });
});
