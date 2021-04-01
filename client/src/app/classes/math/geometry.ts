import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { Line } from './line';

export class Geometry {
    static getDistanceBetween(initial: Vec2, final: Vec2): number {
        const dp: Vec2 = final.substract(initial);
        return Math.sqrt(dp.x * dp.x + dp.y * dp.y);
    }

    // Returns vector's angle pointing from [initial] to final in radians
    static getAngle(initial: Vec2, final: Vec2): number {
        const dp: Vec2 = initial.substract(final);
        return -Math.atan2(dp.y, dp.x) + Math.PI;
    }

    static toDegrees(radians: number): number {
        return (radians * ToolMath.DEGREE_CONVERSION_FACTOR) / Math.PI;
    }

    static toRadians(degrees: number): number {
        return (degrees * Math.PI) / ToolMath.DEGREE_CONVERSION_FACTOR;
    }

    static isAPoint(path: Vec2[]): boolean {
        const isPoint = path.length === 1;
        return isPoint || (path.length === 2 && path[0].equals(path[1]));
    }

    /**
     *  Can return -0
     *
     *  -0 === +0 returns true
     */
    static roundTowardsZero(value: number): number {
        return value >= 0 ? Math.floor(value) : Math.ceil(value);
    }

    static lastLineIntersecting(lines: Line[], nextLine: Line): boolean {
        for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i].intersects(nextLine)) {
                return true;
            }
        }

        return false;
    }
}
