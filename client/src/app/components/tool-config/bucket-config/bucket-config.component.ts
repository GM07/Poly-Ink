import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { BucketService } from './../../../services/tools/bucket.service';

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

    colorSliderLabel(value: number): string {
        return value + '%';
    }
}
