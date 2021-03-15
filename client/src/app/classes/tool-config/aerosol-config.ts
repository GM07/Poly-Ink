import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class AerosolConfig {
    dropletDiameter: number = ToolSettingsConst.MIN_DROPLETS_WIDTH;
    areaDiameter: number = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
    nDropletsPerSpray: number = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
    droplets: Vec2[][] = [];

    clone(): AerosolConfig {
        let config = new AerosolConfig();

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
