import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class AerosolConfig {
    dropletDiameter: number = ToolSettingsConst.MIN_DROPLETS_WIDTH;
    areaDiameter: number = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
    nDropletsPerSpray: number = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
    droplets: Vec2[][] = [];
}
