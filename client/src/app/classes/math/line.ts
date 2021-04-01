import { Vec2 } from '@app/classes/vec2';

export class Line {
    start: Vec2;
    end: Vec2;

    constructor(start: Vec2, end: Vec2) {
        this.start = start;
        this.end = end;
    }

    /**
     * Based on https://math.stackexchange.com/questions/149622/finding-out-whether-two-line-segments-intersect-each-other
     */
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
    }
}
