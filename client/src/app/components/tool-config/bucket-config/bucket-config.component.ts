import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { BucketService } from '@app/services/tools/bucket.service';

@Component({
    selector: 'app-bucket-config',
    templateUrl: './bucket-config.component.html',
    styleUrls: ['./bucket-config.component.scss'],
})
export class BucketConfigComponent extends ToolConfig {
    readonly MIN: number = ToolSettingsConst.BUCKET_MIN_TOLERANCE;
    readonly MAX: number = ToolSettingsConst.BUCKET_MAX_TOLERANCE;

    constructor(public bucketService: BucketService) {
        super();
    }

    changeTolerance(event: MatSliderChange): void {
        this.bucketService.config.tolerance = event.value as number;
    }
}
