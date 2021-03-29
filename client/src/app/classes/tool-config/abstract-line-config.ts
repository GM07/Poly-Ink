import { Vec2 } from '@app/classes/vec2';

export class AbstractLineConfig {
    points: Vec2[];

    constructor() {
        this.points = [];
    }

    clone(): AbstractLineConfig {
        const config = new AbstractLineConfig();
        this.points.forEach((point) => {
            config.points.push(point.clone());
        });
        return config;
    }
}
