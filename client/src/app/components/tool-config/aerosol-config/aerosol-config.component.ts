import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { AerosolService } from '@app/services/tools/aerosol.service';

@Component({
    selector: 'app-aerosol-config',
    templateUrl: './aerosol-config.component.html',
    styleUrls: ['./aerosol-config.component.scss'],
})
export class AerosolConfigComponent extends ToolConfig {
    readonly MIN_AREA: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX_AREA: number = ToolSettingsConst.MAX_WIDTH;
    readonly MIN_DROPLETS: number = ToolSettingsConst.MIN_DROPLETS_WIDTH;
    readonly MAX_DROPLETS: number = ToolSettingsConst.MAX_DROPLETS_WIDTH;
    readonly MIN_EMISSIONS_PER_SECOND: number = ToolSettingsConst.MIN_EMISSIONS_PER_SECOND;
    readonly MAX_EMISSIONS_PER_SECOND: number = ToolSettingsConst.MAX_EMISSIONS_PER_SECOND;

    constructor(public aerosolService: AerosolService) {
        super();
    }

    sliderLabel(value: number): string {
        return value + 'px';
    }
}
