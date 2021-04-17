import { Vec2 } from '@app/classes/vec2';

export class Line {
    static i = 0;

    constructor(public start: Vec2, public end: Vec2) {}

    /**
     * Based on https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
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
            (orientation1 === 0 && this.onLine(this, other.start) && !isPreviousLine) ||
            (orientation2 === 0 && this.onLine(this, other.end) && !isStartLine) ||
            (orientation3 === 0 && this.onLine(other, this.start) && !isStartLine) ||
            (orientation4 === 0 && this.onLine(other, this.end) && !isPreviousLine)
        );
    }

    private orientation(p1: Vec2, p2: Vec2, p3: Vec2): number {
        return Math.sign(Math.round((p3.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p1.x)));
    }

    private onLine(line: Line, q: Vec2): boolean {
        return (
            q.x <= Math.max(line.start.x, line.end.x) &&
            q.x >= Math.min(line.start.x, line.end.x) &&
            q.y <= Math.max(line.start.y, line.end.y) &&
            q.y >= Math.min(line.start.y, line.end.y)
        );
    }

    /*
    intersects(other: Line): boolean {
        const halfSpaceStart = this.halfSpaceFunction(other.start);
        const halfSpaceEnd = this.halfSpaceFunction(other.end);

        if (halfSpaceStart === halfSpaceEnd && halfSpaceStart === 0) {
            return this.intersecting(other);
        }

        return halfSpaceStart * halfSpaceEnd <= 0 && other.halfSpaceFunction(this.start) * other.halfSpaceFunction(this.end) < 0;
    }

    private intersecting(other: Line): boolean {
        return (
            Math.min(other.start.x, other.end.x) <= Math.max(this.start.x, this.end.x) &&
            Math.max(other.start.x, other.end.x) >= Math.min(this.start.x, this.end.x) &&
            Math.min(other.start.y, other.end.y) <= Math.max(this.start.y, this.end.y) &&
            Math.max(other.start.y, other.end.y) >= Math.min(this.start.y, this.end.y)
        );
    }

    private halfSpaceFunction(pointToCheck: Vec2): number {
        return this.determinant(this.end.substract(this.start), pointToCheck.substract(this.start));
    }

    private determinant(a: Vec2, b: Vec2): number {
        return a.x * b.y - a.y * b.x;
    }*/

    /**
     * Based on https://math.stackexchange.com/questions/149622/finding-out-whether-two-line-segments-intersect-each-other
     */
}
