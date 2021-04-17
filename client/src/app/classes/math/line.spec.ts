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

    it('should create', () => {
        expect(a).toBeTruthy();
        expect(b).toBeTruthy();
    });

    it('should return the correct orientation with 3 points', () => {
        expect(a['orientation'](a.start, a.end, b.start)).toBeLessThan(0);
    });

    it('should indicate if a point is on a line', () => {
        const p = new Vec2(0, 0);
        expect(a['isInLine'](1, a, p)).toBeFalsy();
    });

    it('should indicate if the line touches the previous line', () => {
        const line = new Line(new Vec2(0, 0), new Vec2(5, 5));
        expect(line['isPreviousLine'](a)).toBeTruthy();
    });

    it('should indicate if the line touches the first line', () => {
        const line = new Line(new Vec2(100, 100), new Vec2(0, 0));
        expect(line['isStartLine'](a)).toBeTruthy();
    });

    it('should return true if lines are intersecting (lines are crossing each other)', () => {
        expect(a.intersects(b)).toBeTruthy();
    });

    it('should return true if lines are intersecting (lines are the same)', () => {
        expect(a.intersects(a)).toBeTruthy();
    });

    it('should return false if lines are not intersecting', () => {
        const newLine: Line = new Line(a.start.add(new Vec2(3, 0)), a.end.add(new Vec2(3, 0)));
        expect(a.intersects(newLine)).toBeFalsy();
    });
});
