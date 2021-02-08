import { Vec2 } from '@app/classes/vec2';

export class Geometry {
    static readonly DEGREE_CONVERSION_FACTOR: number = 180;

    static getDistanceBetween(initial: Vec2, final: Vec2): number {
        const dx: number = final.x - initial.x;
        const dy: number = final.y - initial.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Retourne l'angle du vecteur pointant de [initial] vers [final] en radians
    static getAngle(initial: Vec2, final: Vec2): number {
        const dx: number = initial.x - final.x;
        const dy: number = initial.y - final.y;
        return -Math.atan2(dy, dx) + Math.PI;
    }

    static toDegrees(radians: number): number {
        return (radians * Geometry.DEGREE_CONVERSION_FACTOR) / Math.PI;
    }

    static toRadians(degrees: number): number {
        return (degrees * Math.PI) / Geometry.DEGREE_CONVERSION_FACTOR;
    }
}