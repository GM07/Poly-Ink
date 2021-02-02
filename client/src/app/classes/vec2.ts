export interface Vec2 {
    x: number;
    y: number;
}

const DEGREE_CONVERSION_FACTOR = 180;

export class VectorHandler {
    static getDistanceBetween(initial: Vec2, final: Vec2): number {
        const dx: number = final.x - initial.x;
        const dy: number = final.y - initial.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    // Retourne l'angle du vecteur pointant de [initial] vers [final] en radians
    static getAngle(initial: Vec2, final: Vec2): number {
        const dx: number = initial.x - final.x;
        const dy: number = initial.y - final.y;
        // TODO : Revoir la formule pour la rendre plus belle
        return -(Math.atan2(dy, dx) + Math.PI) + 2 * Math.PI;
    }

    static toDegrees(radians: number): number {
        return (radians * DEGREE_CONVERSION_FACTOR) / Math.PI;
    }

    static toRadians(degrees: number): number {
        return (degrees * Math.PI) / DEGREE_CONVERSION_FACTOR;
    }
}
