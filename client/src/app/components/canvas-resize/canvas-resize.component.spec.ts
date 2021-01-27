import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasResizeComponent } from './canvas-resize.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingComponent } from '@app/components/drawing/drawing.component';

describe('CanvasResizeComponent', () => {
  let component: CanvasResizeComponent;
  let fixture: ComponentFixture<CanvasResizeComponent>;
  let service: DrawingService;
  let canvasTestHelper: CanvasTestHelper;

  beforeEach(async(() => {
    service = new DrawingService();
    TestBed.configureTestingModule({
      declarations: [ CanvasResizeComponent, DrawingComponent],
      providers:  [
        { provide: DrawingService, useValue: service },
      ],
    })
    .compileComponents();
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be smaller than 250px', () =>{
    component.resizeCanvas(10,10);
    expect(service.canvas.width).toEqual(250);
    expect(service.canvas.height).toEqual(250);
  });

  it('preview canvas should be equal to canvas', () => {
    component.resizeCanvas(125, 273);
    expect(service.canvas.width).toEqual(service.previewCanvas.width);
    expect(service.canvas.height).toEqual(service.previewCanvas.height);
  });

  it('shoud draw white pixels', () =>{
    component.resizeCanvas(125,125);
    component.resizeCanvas(126,125);
    const pixelBuffer = service.baseCtx.getImageData(126,125,1,1).data;
    const stringPixelBuffer = String(pixelBuffer[0]) + String(pixelBuffer[1]) + String(pixelBuffer[2]);
    expect(stringPixelBuffer).toBe("255255255"); //Représente un pixel avec le rvb à 255
  })

  it('should resize when dragging the left side', ()=>{
    const xPos = component.getCanvasLeft();
    const yPos = service.canvas.height + component.getCanvasTop() - Math.floor(Math.random() * 10); //Petite valeurs pour simuler un clic
    const downEvent = new MouseEvent("document:mouseDown", {clientX: xPos, clientY: yPos});
    const moveEvent = new MouseEvent("document:mouseMove", {clientX: xPos+25, clientY: yPos+25});
    const upEvent = new MouseEvent("document:mouseUp", {clientX: xPos+25, clientY: yPos+25});
    component.onMouseDown(downEvent);
    expect(component.getMoveBottom()).toBe(true);
    expect(component.getMoveRight()).toBe(false);
    component.onMouseMove(moveEvent);
    component.onMouseUp(upEvent);
    expect(service.canvas.height).toBe(yPos-component.getCanvasTop()+25);
     });

     it('should resize when dragging the bottom side', ()=>{
      const xPos = service.canvas.width + component.getCanvasLeft() - Math.floor(Math.random() * 10);
      const yPos = component.getCanvasTop(); //Petite valeurs pour simuler un clic
      const downEvent = new MouseEvent("document:mouseDown", {clientX: xPos, clientY: yPos});
      const moveEvent = new MouseEvent("document:mouseMove", {clientX: xPos+25, clientY: xPos+25});
      const upEvent = new MouseEvent("document:mouseUp", {clientX: xPos+25, clientY: xPos+25});
      component.onMouseDown(downEvent);
      expect(component.getMoveBottom()).toBe(false);
      expect(component.getMoveRight()).toBe(true);
      component.onMouseMove(moveEvent);
      component.onMouseUp(upEvent);
      expect(service.canvas.width).toBe(xPos - component.getCanvasLeft()+25);
       });

       it('should resize when dragging the corner', ()=>{
        const xPos = service.canvas.width + component.getCanvasLeft() - Math.floor(Math.random() * 10);
        const yPos = service.canvas.height + component.getCanvasTop() - Math.floor(Math.random() * 10); //Petite valeurs pour simuler un clic
        const downEvent = new MouseEvent("document:mouseDown", {clientX: xPos, clientY: yPos});
        const moveEvent = new MouseEvent("document:mouseMove", {clientX: 0, clientY: 0});
        const upEvent = new MouseEvent("document:mouseUp", {clientX: 0, clientY: 0});
        component.onMouseDown(downEvent);
        expect(component.getMoveBottom()).toBe(true);
        expect(component.getMoveRight()).toBe(true);
        component.onMouseMove(moveEvent);
        component.onMouseUp(upEvent);
        expect(service.canvas.width).toBe(250);
        expect(service.canvas.height).toBe(250);
         });

         it('should not resize when clicking elsewhere', ()=>{
           let canvasWidth = service.canvas.width;
           let canvasHeight = service.canvas.height;
          const downEvent = new MouseEvent("document:mouseDown", {clientX: 0, clientY: 0});
          const moveEvent = new MouseEvent("document:mouseMove", {clientX: 0, clientY: 0});
          const upEvent = new MouseEvent("document:mouseUp", {clientX: 0, clientY: 0});
          component.onMouseDown(downEvent);
          expect(component.getMoveBottom()).toBe(false);
          expect(component.getMoveRight()).toBe(false);
          component.onMouseMove(moveEvent);
          component.onMouseUp(upEvent);
          expect(canvasWidth).toBe(service.canvas.width);
          expect(canvasHeight).toBe(service.canvas.height);
         });

         it('should not drag with other click', ()=>{
          const downEvent = new MouseEvent("document:mouseDown", {button:1});
          const mouseEventSpy = spyOn(component, 'onMouseDown').and.callThrough();
          component.onMouseDown(downEvent);
          expect(mouseEventSpy).toHaveBeenCalled();
          expect(mouseEventSpy).toHaveBeenCalledWith(downEvent);
         });



});
