import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-previous-colors',
    templateUrl: './previous-colors.component.html',
    styleUrls: ['./previous-colors.component.scss'],
})
export class PreviousColorsComponent implements OnDestroy {
    previousColors: Color[];
    previousColorSubscription: Subscription;

    constructor(private colorService: ColorService) {
        this.initValues();
        this.initSubscription();
    }

    initValues(): void {
        this.previousColors = this.colorService.previousColors;
    }

    initSubscription(): void {
        this.previousColorSubscription = this.colorService.previousColorsChange.subscribe((value) => {
            this.previousColors = value;
        });
    }

    ngOnDestroy(): void {
        this.previousColorSubscription.unsubscribe();
    }

    selectPrimaryColor(color: Color): void {
        this.colorService.primaryColor = color;
    }

    selectSecondaryColor(color: Color): void {
        this.colorService.secondaryColor = color;
    }
}
