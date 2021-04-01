import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { BucketService } from './bucket.service';

describe('BucketService', () => {
    let service: BucketService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryColor: Colors.BLACK });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service = TestBed.inject(BucketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set contiguous on left click', () => {
        const event = {
            pageX: 1,
            pageY: 1,
            button: MouseButton.Left,
        } as MouseEvent;
        spyOn(service, 'isInCanvas').and.returnValue(false);
        service.onMouseDown(event);
        expect(service.config.contiguous).toEqual(true);
    });

    it('should set not contiguous on right click', () => {
        const event = {
            button: MouseButton.Right,
        } as MouseEvent;

        spyOn(service, 'isInCanvas').and.returnValue(false);
        service.onMouseDown(event);
        expect(service.config.contiguous).toEqual(false);
    });

    it('should return if button clicked is not left or right', () => {
        const event = {
            pageX: 1,
            pageY: 1,
            button: MouseButton.Middle,
        } as MouseEvent;
        spyOn(service, 'draw').and.stub();
        service.onMouseDown(event);
        expect(service.draw).not.toHaveBeenCalled();
    });

    it('Should call draw when mouseclick in canvas', () => {
        const event = {
            pageX: 1,
            pageY: 1,
            button: MouseButton.Right,
        } as MouseEvent;
        spyOn(service, 'isInCanvas').and.returnValue(true);
        spyOn(service, 'getPositionFromMouse').and.stub();
        spyOn(service, 'draw').and.stub();
        service.onMouseDown(event);
        expect(service.getPositionFromMouse).toHaveBeenCalled();
        expect(service.draw).toHaveBeenCalled();
    });

    it('Should not call draw when mousclick is out of canvas', () => {
        canvasTestHelper.canvas.width = 1;
        canvasTestHelper.canvas.height = 1;
        const event = {
            pageX: 2,
            pageY: 2,
            button: MouseButton.Right,
        } as MouseEvent;
        spyOn(service, 'isInCanvas').and.returnValue(false);
        spyOn(service, 'draw').and.stub();
        service.onMouseDown(event);
        expect(service.draw).not.toHaveBeenCalled();
    });

    it('should draw properly', () => {
        service.draw();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });
});
