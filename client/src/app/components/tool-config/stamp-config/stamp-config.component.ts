import { Component, OnDestroy, OnInit } from '@angular/core';
import { Stamp } from '@app/classes/tool-config/stamp-config';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp-config',
    templateUrl: './stamp-config.component.html',
    styleUrls: ['./stamp-config.component.scss'],
})
export class StampConfigComponent implements OnInit, OnDestroy {
    constructor(public stampService: StampService) {}
    // The static _this is used to preserve the context in the event
    static this: StampConfigComponent;
    readonly MAX_SCALE: number = ToolSettingsConst.STAMP_MAX_VALUE;
    readonly MIN_SCALE: number = ToolSettingsConst.STAMP_MIN_VALUE;
    readonly MIN_ROTATION: number = ToolSettingsConst.STAMP_MIN_ANGLE;
    readonly MAX_ROTATION: number = (ToolSettingsConst.STAMP_MAX_ANGLE / Math.PI) * ToolMath.DEGREE_CONVERSION_FACTOR;
    readonly ROTATION: number = 15;
    stampMode: typeof Stamp = Stamp;

    ngOnInit(): void {
        StampConfigComponent.this = this;
        window.addEventListener('mousewheel', this.wheelEvent, { passive: false });
    }

    ngOnDestroy(): void {
        window.removeEventListener('mousewheel', this.wheelEvent);
    }

    wheelEvent(event: WheelEvent): void {
        if (StampConfigComponent.this.stampService.isActive()) {
            event.preventDefault();
            StampConfigComponent.this.stampService.angleValue =
                StampConfigComponent.this.stampService.angleValue +
                Math.sign(event.deltaY) * (StampConfigComponent.this.stampService.alt.isDown ? 1 : StampConfigComponent.this.ROTATION);
            StampConfigComponent.this.stampService.drawPreview();
        }
    }

    colorSliderLabel(value: number): string {
        return value + 'x';
    }

    toggleStamp(stamp: Stamp): void {
        this.stampService.config.stamp = stamp;
        this.stampService.updateStampValue();
    }
}
