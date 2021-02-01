export interface Vec2 {
    x: number;
    y: number;
}

export function getDistanceBetween(initial: Vec2, final: Vec2): number {
    let dx: number = final.x - initial.x;
    let dy: number = final.y - initial.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Retourne l'angle du vecteur pointant de [initial] vers [final] en radians
export function getAngle(initial: Vec2, final: Vec2): number {
    let dx: number = initial.x - final.x;
    let dy: number = initial.y - final.y;
    // TODO : Revoir la formule pour la rendre plus belle
    return -(Math.atan2(dy, dx) + Math.PI) + 2 * Math.PI;
}

export function toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
}

export function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}
