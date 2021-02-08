import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from '@app/components/color-picker/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-icon',
    templateUrl: './color-icon.component.html',
    styleUrls: ['./color-icon.component.scss'],
})
export class ColorIconComponent implements OnInit, OnDestroy {
    @Input()
    width: number;

    @Input()
    height: number;

    colorPreviewOffsetWidth: number;
    colorPreviewOffsetHeight: number;

    swapIconSize: number;

    primaryColor: string;
    primaryColorSubscription: Subscription;

    secondaryColor: string;
    secondaryColorSubscription: Subscription;

    constructor(private colorService: ColorService) {
        this.initValues();
        this.initSubscriptions();
    }

    initValues(): void {
        this.primaryColor = this.colorService.rgba(this.colorService.primaryColor, 1);
        this.secondaryColor = this.colorService.rgba(this.colorService.secondaryColor, 1);
    }

    initSubscriptions(): void {
        this.primaryColorSubscription = this.colorService.primaryColorChange.subscribe((value) => {
            this.primaryColor = this.colorService.rgba(value, 1);
        });

        this.secondaryColorSubscription = this.colorService.secondaryColorChange.subscribe((value) => {
            this.secondaryColor = this.colorService.rgba(value, 1);
        });
    }

    get swapIconOffsetTop(): number {
        return this.height - this.swapIconSize;
    }

    get swapIconOffsetLeft(): number {
        return this.width - this.swapIconSize;
    }

    get colorPreviewHeight(): number {
        return this.height - this.swapIconSize - this.colorPreviewOffsetHeight;
    }

    get colorPreviewWidth(): number {
        return this.width - this.swapIconSize - this.colorPreviewOffsetWidth;
    }

    swap(): void {
        this.colorService.swap();
    }

    ngOnInit(): void {
        const widthToIconRatio = 3;
        const widthToColorPreviewRatio = 5;
        this.swapIconSize = this.width / widthToIconRatio;
        this.colorPreviewOffsetWidth = (this.width - this.swapIconSize) / widthToColorPreviewRatio;
        this.colorPreviewOffsetHeight = (this.height - this.swapIconSize) / widthToColorPreviewRatio;
    }

    ngOnDestroy(): void {
        this.primaryColorSubscription.unsubscribe();
        this.secondaryColorSubscription.unsubscribe();
    }
}
