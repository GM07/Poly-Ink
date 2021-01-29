import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_SIZE, MIN_SIZE } from './constants';

@Component({
    selector: 'app-tool-config',
    templateUrl: './tool-config.component.html',
    styleUrls: ['./tool-config.component.scss'],
})
export class ToolConfigComponent {
    // TODO Bind all these to the tool!
    // Size Config
    lineSizeMax: number = MAX_SIZE;
    lineSizeMin: number = MIN_SIZE;
    sizeValue: number;

    // Color Config
    color: string = 'black';
    displayColorPicker: boolean = false;

    constructor(public dialogRef: MatDialogRef<ToolConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    // Could be useful for the tools?
    changeColor(color: string): void {
        this.color = color.toLowerCase();
    }

    // Could be useful to display the color picker (it would actually be an openDialog again, cuz the Color Picker should also be a dialog :$$$)
    toggleColorPicker(): void {
        this.displayColorPicker = !this.displayColorPicker;
    }
}
