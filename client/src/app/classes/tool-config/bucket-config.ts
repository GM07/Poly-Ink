import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class BucketConfig {
    point: Vec2;
    contiguous: boolean;
    tolerance: number;

    constructor() {
        this.point = new Vec2(0, 0);
        this.contiguous = true;
        this.tolerance = ToolSettingsConst.BUCKET_DEFAULT_TOLERANCE;
    }

    clone(): BucketConfig {
        const config = new BucketConfig();

        config.contiguous = this.contiguous;
        config.tolerance = this.tolerance;
        config.point = this.point.clone()

        return config;
    }
}
