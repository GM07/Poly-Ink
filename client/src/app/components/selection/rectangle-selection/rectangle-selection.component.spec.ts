import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionComponent } from './rectangle-selection.component';

describe('RectangleSelectionComponent', () => {
    let component: RectangleSelectionComponent;
    let fixture: ComponentFixture<RectangleSelectionComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let service: DrawingService;

    beforeEach(async(() => {
        service = new DrawingService();
        TestBed.configureTestingModule({
            declarations: [RectangleSelectionComponent],
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

        fixture = TestBed.createComponent(RectangleSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
