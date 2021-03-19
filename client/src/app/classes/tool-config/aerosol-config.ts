import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class AerosolConfig {
    dropletDiameter: number;
    areaDiameter: number;
    nDropletsPerSpray: number;
    droplets: Vec2[][];

    constructor() {
        this.dropletDiameter = ToolSettingsConst.MIN_DROPLETS_WIDTH;
        this.areaDiameter = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.nDropletsPerSpray = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.droplets = [];
    }

    clone(): AerosolConfig {
        const config = new AerosolConfig();

        this.droplets.forEach((points, index) => {
            config.droplets.push([]);
            points.forEach((point) => {
                config.droplets[index].push({ x: point.x, y: point.y });
            });
        });
        config.areaDiameter = this.areaDiameter;
        config.dropletDiameter = this.dropletDiameter;
        config.nDropletsPerSpray = this.nDropletsPerSpray;

        return config;
    }
}
