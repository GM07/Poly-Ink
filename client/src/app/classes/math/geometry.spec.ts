import { Vec2 } from '@app/classes/vec2';
import { Geometry } from './geometry';

/* tslint:disable */
describe('Geometry', () => {
    it('should get distance between (4, 5) and (1, 1)', () => {
        const initial: Vec2 = new Vec2(4, 5);
        const final: Vec2 = new Vec2(1, 1);
        const distance: number = Geometry.getDistanceBetween(initial, final);
        expect(distance).toBe(5);
    });

    it('should get distance between (0, 0) and (0, 0)', () => {
        const initial: Vec2 = new Vec2(0, 0);
        const final: Vec2 = new Vec2(0, 0);
        const distance: number = Geometry.getDistanceBetween(initial, final);
        expect(distance).toBe(0);
    });

    it('should get angle from (0, 0) to (3, 3)', () => {
        const initial: Vec2 = new Vec2(0, 0);
        const final: Vec2 = new Vec2(3, 3);
        const distance: number = Geometry.toDegrees(Geometry.getAngle(initial, final));
        expect(distance).toBe(315);
    });

    it('should convert to degrees', () => {
        const angle: number = Geometry.toDegrees(Math.PI * 0.75);
        expect(angle).toBe(135);
    });

    it('should convert to radians', () => {
        const angle: number = Geometry.toRadians(45);
        expect(angle).toBe(Math.PI / 4);
    });

    it('verifies if it is a point', () => {
        let point: Vec2[] = [];
        expect(Geometry.isAPoint(point)).toBeFalsy();
        point = [new Vec2(1,1)];
        expect(Geometry.isAPoint(point)).toBeTruthy();
        point = [new Vec2(1, 1), new Vec2(1, 1)];
        expect(Geometry.isAPoint(point)).toBeTruthy();
        point = [new Vec2(1, 1), new Vec2(1, 2)];
        expect(Geometry.isAPoint(point)).toBeFalsy();
    });

    it('should floor towards 0', () => {
        let value: number = 0.7;
        expect(Geometry.roundTowardsZero(value) === 0).toBeTruthy();
        value = -0.7;
        expect(Geometry.roundTowardsZero(value) === 0).toBeTruthy();
        value = -1.1;
        expect(Geometry.roundTowardsZero(value)).toEqual(-1);
    });
});
