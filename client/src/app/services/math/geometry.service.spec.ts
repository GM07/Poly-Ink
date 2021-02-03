import { Vec2 } from '@app/classes/vec2';
import { GeometryService } from './geometry.service';

describe('GeometryService', () => {
    it('should get distance between (4, 5) and (1, 1)', () => {
        const initial: Vec2 = { x: 4, y: 5 };
        const final: Vec2 = { x: 1, y: 1 };
        const distance: number = GeometryService.getDistanceBetween(initial, final);
        expect(distance).toBe(5);
    });

    it('should get distance between (0, 0) and (0, 0)', () => {
        const initial: Vec2 = { x: 0, y: 0 };
        const final: Vec2 = { x: 0, y: 0 };
        const distance: number = GeometryService.getDistanceBetween(initial, final);
        expect(distance).toBe(0);
    });

    it('should get angle from (0, 0) to (3, 3)', () => {
        const initial: Vec2 = { x: 0, y: 0 };
        const final: Vec2 = { x: 3, y: 3 };
        const distance: number = GeometryService.toDegrees(GeometryService.getAngle(initial, final));
        // Il ne faut pas oublier que l'axe des y est vers le bas
        expect(distance).toBe(315);
    });

    it('should convert to degrees', () => {
        const angle: number = GeometryService.toDegrees(Math.PI * 0.75);
        expect(angle).toBe(135);
    });

    it('should convert to radians', () => {
        const angle: number = GeometryService.toRadians(45);
        expect(angle).toBe(Math.PI / 4);
    });
});
