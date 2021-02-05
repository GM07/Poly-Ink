import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { LineService } from './line-service';
import { MouseButton } from './pencil-service';

// tslint:disable:no-any
describe('LigneService', () => {
    let service: LineService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add point on mouse position on first mouse down', () => {
        const mouseEvent = { button: MouseButton.Left, offsetX: 300, offsetY: 400 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        const points: Vec2[] = service['points'];
        expect(points.length).toBe(1);
        const addedPoint = points[0];
        expect(addedPoint).toEqual({ x: 300, y: 400 } as Vec2);
    });

    it('should add point on mouse position on first mouse down', () => {
        const mouseEvent = { button: MouseButton.Left, offsetX: 300, offsetY: 400 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        const points: Vec2[] = service['points'];
        expect(points.length).toBe(1);
        const addedPoint = points[0];
        expect(addedPoint).toEqual({ x: 300, y: 400 } as Vec2);
    });

    // it('should stop drawing when asked to', () => {
    //     spyOn<any>(service, 'stopDrawing').and.callThrough();
    //     service.stopDrawing();
    //     expect(service.stopDrawing).toHaveBeenCalled();
    // });

    it('should align points', () => {
        service['points'] = [
            { x: 500, y: 500 },
            { x: 200, y: 300 },
        ];

        const cursor: Vec2 = { x: 210, y: 200 };
        const result: Vec2 = service.alignPoint(cursor);
        expect(result).toEqual({ x: 200, y: 200 });
    });

    it('should return last point', () => {
        service['points'] = [
            { x: 400, y: 500 },
            { x: 189, y: 250 },
        ];

        expect(service['getLastPoint']()).toEqual({ x: 189, y: 250 });
    });
});
