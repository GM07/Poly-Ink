import { Vec2 } from '@app/classes/vec2';
import { Line } from './line';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
describe('Line', () => {
    let a: Line;
    let b: Line;

    beforeEach(() => {
        a = new Line(new Vec2(5, 5), new Vec2(100, 100));
        b = new Line(new Vec2(100, 5), new Vec2(5, 100));
    });

    it('should return correct value for determinant', () => {
        expect(a['determinant'](a.start, b.start)).toEqual(-475);
    });

    it('should correct correct value for half space function', () => {
        expect(a['halfSpaceFunction'](b.start)).toEqual(-9025);
    });

    it('should return true if lines are intersecting (lines are crossing each other)', () => {
        expect(a.intersects(b)).toEqual(true);
    });

    it('should return true if lines are intersecting (lines are the same)', () => {
        expect(a.intersects(a)).toEqual(true);
    });

    it('should return false if lines are not intersecting', () => {
        const newLine: Line = new Line(a.start.add(new Vec2(3, 0)), a.end.add(new Vec2(3, 0)));
        expect(a.intersects(newLine)).toEqual(false);
    });
});
