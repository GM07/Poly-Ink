import { ColorService } from "src/color-picker/services/color.service";
import { StampConfig } from "../tool-config/stamp-config";
import { Vec2 } from "../vec2";
import { AbstractDraw } from "./abstract-draw";

export class StampDraw extends AbstractDraw{
  private config: StampConfig;

  constructor(colorService: ColorService, stampConfig: StampConfig) {
    super(colorService);
    this.config = stampConfig.clone();
}

  execute(context: CanvasRenderingContext2D): void {
    this.rotateAndPaintImage(context, this.config.etampeImg, this.config.angle, this.config.position);
  }

  rotateAndPaintImage ( context: CanvasRenderingContext2D, image: HTMLImageElement, angleInRad: number , position: Vec2) {
    context.translate( position.x, position.y );
    context.rotate( angleInRad );
    context.drawImage( image, -50*this.config.scale/2, -50*this.config.scale/2,  50*this.config.scale, 50*this.config.scale);
    context.rotate( -angleInRad );
    context.translate( -position.x, -position.y );
  }

}
