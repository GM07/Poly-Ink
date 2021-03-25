export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }
}
