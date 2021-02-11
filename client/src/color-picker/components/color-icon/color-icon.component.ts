import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-color-icon',
    templateUrl: './color-icon.component.html',
    styleUrls: ['./color-icon.component.scss'],
})
export class ColorIconComponent {
    @Input()
    width: number;

    @Input()
    height: number;

    @ViewChild(MatMenuTrigger) colorMenuTrigger: MatMenuTrigger;

    colorPreviewOffsetWidth: number;
    colorPreviewOffsetHeight: number;

    swapIconSize: number;

    constructor(public colorService: ColorService) {}

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

    openColorPicker(): void {
        this.colorService.selectedColorFromHex = this.colorService.primaryColor;
        this.colorMenuTrigger.openMenu();
    }

    checkIfMenuClose(event: MouseEvent): void {
        //Check if any button is clicked on menu to close it
        //TODO - Find a better way kinda hacky
        const className: string = (event.target as Element).className;
        if (className.includes('button')) return;
        event.stopPropagation();
    }
}
