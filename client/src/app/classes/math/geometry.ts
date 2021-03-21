import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';

export class Geometry {
    static getDistanceBetween(initial: Vec2, final: Vec2): number {
        const dx: number = final.x - initial.x;
        const dy: number = final.y - initial.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Returns vector's angle pointing from [initial] to final in radians
    static getAngle(initial: Vec2, final: Vec2): number {
        const dx: number = initial.x - final.x;
        const dy: number = initial.y - final.y;
        return -Math.atan2(dy, dx) + Math.PI;
    }

    static toDegrees(radians: number): number {
        return (radians * ToolMath.DEGREE_CONVERSION_FACTOR) / Math.PI;
    }

    static toRadians(degrees: number): number {
        return (degrees * Math.PI) / ToolMath.DEGREE_CONVERSION_FACTOR;
    }

    static isAPoint(path: Vec2[]): boolean {
        const isPoint = path.length === 1;
        return isPoint || (path.length === 2 && path[0].x === path[1].x && path[0].y === path[1].y);
    }

    /**
     *  Can return -0
     *
     *  -0 === +0 returns true
     */
    static roundTowardsZero(value: number): number {
        return value >= 0 ? Math.floor(value) : Math.ceil(value);
    }
}
