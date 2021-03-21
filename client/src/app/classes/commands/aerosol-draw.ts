import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { Prng } from '@app/classes/math/prng';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { Vec2 } from '@app/classes/vec2';
import * as seedrandom from 'seedrandom';
import { ColorService } from 'src/color-picker/services/color.service';
export class AerosolDraw extends AbstractDraw {
    private config: AerosolConfig;

    constructor(colorService: ColorService, config: AerosolConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.primaryRgba;
        context.strokeStyle = this.primaryRgba;
        context.lineWidth = this.config.areaDiameter;
        context.lineCap = 'round' as CanvasLineCap;
        context.lineJoin = 'round' as CanvasLineJoin;

        for (let i = 0; i < this.config.seeds.length; i++) {
            const prng: Prng = seedrandom(this.config.seeds[i]);
            for (let nDroplets = 0; nDroplets < this.config.nDropletsPerSpray; nDroplets++) {
                const point: Vec2 = this.getRandomPoint(prng, this.config.points[i]);
                this.drawDroplet(context, point);
            }
        }
    }

    private getRandomPoint(prng: Prng, point: Vec2): Vec2 {
        const areaRadius = this.config.areaDiameter / 2;
        const angle = Math.PI * prng() * this.config.areaDiameter;
        const randomDistFromCenter = prng() * areaRadius + prng() * areaRadius;
        const randomRadius = randomDistFromCenter > areaRadius ? this.config.areaDiameter - randomDistFromCenter : randomDistFromCenter;

        return {
            x: Math.cos(angle) * randomRadius + point.x,
            y: Math.sin(angle) * randomRadius + point.y,
        };
    }

    private drawDroplet(context: CanvasRenderingContext2D, point: Vec2): void {
        context.beginPath();
        context.arc(point.x, point.y, this.config.dropletDiameter / 2, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();
    }
}
