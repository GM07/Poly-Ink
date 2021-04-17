import { Vec2 } from '@app/classes/vec2';

export class Line {
    constructor(public start: Vec2, public end: Vec2) {}

    /**
     * Based on https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
     * and https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
     */
    intersects(other: Line): boolean {
        const isPreviousLine = this.end.x === other.start.x && this.end.y === other.start.y;
        const isStartLine = this.start.x === other.end.x && this.start.y === other.end.y;

        const orientation1 = this.orientation(this.start, this.end, other.start);
        const orientation2 = this.orientation(this.start, this.end, other.end);
        const orientation3 = this.orientation(other.start, other.end, this.start);
        const orientation4 = this.orientation(other.start, other.end, this.end);

        if (orientation1 != orientation2 && orientation3 != orientation4 && !isPreviousLine && !isStartLine) return true;

        return (
            (orientation1 === 0 && this.inLineRange(this, other.start) && !isPreviousLine) ||
            (orientation2 === 0 && this.inLineRange(this, other.end) && !isStartLine) ||
            (orientation3 === 0 && this.inLineRange(other, this.start) && !isStartLine) ||
            (orientation4 === 0 && this.inLineRange(other, this.end) && !isPreviousLine)
        );
    }

    private orientation(p1: Vec2, p2: Vec2, p3: Vec2): number {
        return Math.sign(Math.round((p3.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p1.x)));
    }

    private inLineRange(line: Line, p: Vec2): boolean {
        return (
            p.x <= Math.max(line.start.x, line.end.x) &&
            p.x >= Math.min(line.start.x, line.end.x) &&
            p.y <= Math.max(line.start.y, line.end.y) &&
            p.y >= Math.min(line.start.y, line.end.y)
        );
    }
}
