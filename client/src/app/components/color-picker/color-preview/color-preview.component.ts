import { Component, OnDestroy } from '@angular/core';
import { ColorService } from '@app/components/color-picker/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-preview',
    templateUrl: './color-preview.component.html',
    styleUrls: ['./color-preview.component.scss'],
})
export class ColorPreviewComponent implements OnDestroy {
    previewColor: string;
    previewColorSubscription: Subscription;

    constructor(private colorService: ColorService) {
        this.initValues();
        this.initSubscription();
    }

    initValues(): void {
        this.previewColor = this.colorService.rgba(this.colorService.primaryColor, this.colorService.primaryColorAlpha);
    }

    initSubscription(): void {
        this.previewColorSubscription = this.colorService.selectedColorChange.subscribe((value) => {
            this.previewColor = this.colorService.rgba(value, 1);
        });
    }

    ngOnDestroy(): void {
        this.previewColorSubscription.unsubscribe();
    }
}
