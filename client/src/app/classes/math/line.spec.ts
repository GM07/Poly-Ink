import { Vec2 } from '@app/classes/vec2';
import { Line } from './line';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
describe('Line', () => {
    let testLine1: Line;
    let testLine2: Line;

    beforeEach(() => {
        testLine1 = new Line(new Vec2(5, 5), new Vec2(100, 100));
        testLine2 = new Line(new Vec2(100, 5), new Vec2(5, 100));
    });

    it('should create', () => {
        expect(testLine1).toBeTruthy();
        expect(testLine2).toBeTruthy();
    });

    it('should return the correct orientation with 3 points', () => {
        expect(testLine1['orientation'](testLine1.start, testLine1.end, testLine2.start)).toBeLessThan(0);
    });

    it('should indicate if a point is on a line', () => {
        const p = new Vec2(0, 0);
        expect(testLine1['isInLine'](1, testLine1, p)).toBeFalsy();
    });

    it('should indicate if the line touches the previous line', () => {
        const line = new Line(new Vec2(0, 0), new Vec2(5, 5));
        expect(line['isPreviousLine'](testLine1)).toBeTruthy();
    });

    it('should indicate if the line touches the first line', () => {
        const line = new Line(new Vec2(100, 100), new Vec2(0, 0));
        expect(line['isStartLine'](testLine1)).toBeTruthy();
    });

    it('should return true if lines are intersecting (lines are crossing each other)', () => {
        expect(testLine1.intersects(testLine2)).toBeTruthy();
    });

    it('should return true if lines are intersecting (lines are the same)', () => {
        expect(testLine1.intersects(testLine1)).toBeTruthy();
    });

    it('should return false if lines are not intersecting', () => {
        const newLine: Line = new Line(testLine1.start.add(new Vec2(3, 0)), testLine1.end.add(new Vec2(3, 0)));
        expect(testLine1.intersects(newLine)).toBeFalsy();
    });
});
