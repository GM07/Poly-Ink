import { Vec2 } from '@app/classes/vec2';

export enum Stamp {
    Alexis = 0,
    Felix = 1,
    Florence = 2,
}

export class StampConfig {
    static readonly stampList: string[] = ['assets/stamps/alexis.png', 'assets/stamps/felix.png', 'assets/stamps/Florence.png'];
    scale: number;
    angle: number; // Angle in radians
    position: Vec2;
    stampImg: HTMLImageElement;
    stamp: Stamp;

    constructor() {
        this.stamp = Stamp.Alexis;
        this.stampImg = new Image();
        this.stampImg.src = StampConfig.stampList[this.stamp];
        this.scale = 1;
        this.angle = 0;
    }

    clone(): StampConfig {
        const config = new StampConfig();
        config.stamp = this.stamp;
        config.scale = this.scale;
        config.angle = this.angle;
        config.stampImg = new Image();
        config.stampImg.src = this.stampImg.src;
        config.position = new Vec2(this.position.x, this.position.y);

        return config;
    }
}
