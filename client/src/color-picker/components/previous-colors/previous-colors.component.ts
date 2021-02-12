import { Component } from '@angular/core';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-previous-colors',
    templateUrl: './previous-colors.component.html',
    styleUrls: ['./previous-colors.component.scss'],
})
export class PreviousColorsComponent {
    constructor(public colorService: ColorService) {}

    selectPrimaryColor(color: Color): void {
        this.colorService.primaryColor = color;
    }

    selectSecondaryColor(color: Color): boolean {
        this.colorService.secondaryColor = color;

        // Prevents context menu from apearing
        return false;
    }
}
