import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class AerosolConfig {
    dropletDiameter: number;
    areaDiameter: number;
    nDropletsPerSpray: number;
    points: Vec2[];
    seed: string;

    constructor() {
        this.dropletDiameter = ToolSettingsConst.MIN_DROPLETS_WIDTH;
        this.areaDiameter = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.nDropletsPerSpray = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.points = [];
        this.seed = '';
    }

    clone(): AerosolConfig {
        const config = new AerosolConfig();

        this.points.forEach((oldPoints) => {
            config.points.push({ x: oldPoints.x, y: oldPoints.y });
        });

        config.seed = this.seed;
        config.areaDiameter = this.areaDiameter;
        config.dropletDiameter = this.dropletDiameter;
        config.nDropletsPerSpray = this.nDropletsPerSpray;

        return config;
    }
}
