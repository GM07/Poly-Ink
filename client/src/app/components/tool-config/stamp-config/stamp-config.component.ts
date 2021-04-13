import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Slider, SliderValues } from '@app/classes/slider';
import { Stamp, StampConfig } from '@app/classes/tool-config/stamp-config';
import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp-config',
    templateUrl: './stamp-config.component.html',
    styleUrls: ['./stamp-config.component.scss'],
})
export class StampConfigComponent implements OnInit, OnDestroy, AfterViewInit {
    // The static _this is used to preserve the context in the event
    static this: StampConfigComponent;

    @ViewChild('angleValue', { static: false }) private angleValue: ElementRef<HTMLElement>;

    readonly MAX_SCALE: number = ToolSettingsConst.STAMP_MAX_VALUE;
    readonly MIN_SCALE: number = ToolSettingsConst.STAMP_MIN_VALUE;
    readonly MIN_ROTATION: number = ToolSettingsConst.STAMP_MIN_ANGLE;
    readonly MAX_ROTATION: number = (ToolSettingsConst.STAMP_MAX_ANGLE / Math.PI) * ToolMath.DEGREE_CONVERSION_FACTOR;
    readonly ROTATION: number = ToolSettingsConst.STAMP_ANGLE_STEP;
    readonly sliderSize: number = 50;
    readonly sliderRadius: number = 25;

    stampMode: typeof Stamp = Stamp;
    slider: Slider;

    constructor(public stampService: StampService) {}

    ngOnInit(): void {
        StampConfigComponent.this = this;
        window.addEventListener('mousewheel', this.wheelEvent, { passive: false });
    }

    ngAfterViewInit(): void {
        const saveAngle = this.stampService.angleValue;
        this.slider = new Slider({ canvasId: 'angleCanvas', continuousMode: false, position: new Vec2(this.sliderSize, this.sliderSize) });
        this.slider.addSlider({
            id: 1,
            radius: this.sliderRadius,
            min: 0,
            max: ToolMath.DEGREE_CONVERSION_FACTOR * 2,
            step: this.ROTATION,
            color: 'gray',
            container: 'angleCanvas',
            changed(angle: SliderValues): void {
                StampConfigComponent.this.stampService.angleValue = angle.deg;
                StampConfigComponent.this.angleValue.nativeElement.innerHTML = Math.round(angle.deg) + '°';
            },
        });
        this.slider.setSliderValue(1, saveAngle);
    }

    ngOnDestroy(): void {
        window.removeEventListener('mousewheel', this.wheelEvent);
    }

    wheelEvent(event: WheelEvent): void {
        if (StampConfigComponent.this.stampService.isActive() && StampConfigComponent.this.stampService.isInCanvas(event)) {
            event.preventDefault();
            let newValue =
                StampConfigComponent.this.stampService.angleValue +
                Math.sign(event.deltaY) * (StampConfigComponent.this.stampService.ALT_KEY.isDown ? 1 : StampConfigComponent.this.ROTATION);
            if (newValue > ToolMath.DEGREE_CONVERSION_FACTOR * 2) newValue -= ToolMath.DEGREE_CONVERSION_FACTOR * 2;
            if (newValue < 0) newValue += ToolMath.DEGREE_CONVERSION_FACTOR * 2;
            StampConfigComponent.this.stampService.angleValue = newValue;

            StampConfigComponent.this.slider.setSliderValue(1, StampConfigComponent.this.stampService.angleValue);
            StampConfigComponent.this.stampService.drawPreview();
        }
    }

    SliderLabel(value: number): string {
        return value + 'x';
    }

    toggleStamp(stamp: Stamp): void {
        this.stampService.config.stamp = stamp;
        this.stampService.config.stampImg.src = StampConfig.stampList[stamp];
    }
}
