import { Vec2 } from "../vec2";

export enum Stamp {
  Alexis = 0,
  Felix = 1,
  Gaya = 2,
};

export class StampConfig {
  static readonly stampList = ['assets/stamps/alexis.png','assets/stamps/felix.png','assets/stamps/alexis.png'];
  scale: number;
  angle: number;
  position: Vec2;
  etampeImg: HTMLImageElement;
  etampe: Stamp;

  constructor() {
    this.etampe = Stamp.Alexis;
    this.etampeImg = new Image();
    this.etampeImg.src = StampConfig.stampList[this.etampe];
    this.scale = 1;
    this.angle = 0;
  }

  clone(): StampConfig {
    const config = new StampConfig();
    config.etampe = this.etampe;
    config.etampeImg = new Image();
    config.etampeImg.src = this.etampeImg.src;
    config.scale = this.scale;
    config.angle = this.angle;
    config.position = {x: this.position.x, y: this.position.y} as Vec2;

    return config;
  }
}
