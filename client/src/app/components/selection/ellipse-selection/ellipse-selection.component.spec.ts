import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseSelectionComponent } from './ellipse-selection.component';

describe('EllipseSelectionComponent', () => {
    let component: EllipseSelectionComponent;
    let fixture: ComponentFixture<EllipseSelectionComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let service: DrawingService;

    beforeEach(async(() => {
        service = new DrawingService();
        TestBed.configureTestingModule({
            declarations: [EllipseSelectionComponent],
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
        fixture = TestBed.createComponent(EllipseSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
