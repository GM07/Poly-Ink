import { Vec2 } from '@app/classes/vec2';

export class Line {
    constructor(public start: Vec2, public end: Vec2) {}

    /**
     * Based on https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
     * and https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
     */
    intersects(other: Line): boolean {
        const isPreviousLine = this.isPreviousLine(other);
        const isStartLine = this.isStartLine(other);

        const orientation1 = this.orientation(this.start, this.end, other.start);
        const orientation2 = this.orientation(this.start, this.end, other.end);
        const orientation3 = this.orientation(other.start, other.end, this.start);
        const orientation4 = this.orientation(other.start, other.end, this.end);

        if (orientation1 !== orientation2 && orientation3 !== orientation4 && !isPreviousLine && !isStartLine) return true;

        return (
            (this.isInLine(orientation1, this, other.start) && !isPreviousLine) ||
            (this.isInLine(orientation2, this, other.end) && !isStartLine) ||
            (this.isInLine(orientation3, other, this.start) && !isStartLine) ||
            (this.isInLine(orientation4, other, this.end) && !isPreviousLine)
        );
    }

    private orientation(point1: Vec2, point2: Vec2, point3: Vec2): number {
        return Math.sign(Math.round((point3.y - point1.y) * (point2.x - point1.x) - (point2.y - point1.y) * (point3.x - point1.x)));
    }

    private isInLine(orientation: number, line: Line, point: Vec2): boolean {
        return (
            orientation === 0 &&
            point.x <= Math.max(line.start.x, line.end.x) &&
            point.x >= Math.min(line.start.x, line.end.x) &&
            point.y <= Math.max(line.start.y, line.end.y) &&
            point.y >= Math.min(line.start.y, line.end.y)
        );
    }

    private isPreviousLine(other: Line): boolean {
        return this.end.x === other.start.x && this.end.y === other.start.y;
    }

    private isStartLine(other: Line): boolean {
        return this.start.x === other.end.x && this.start.y === other.end.y;
    }
}
