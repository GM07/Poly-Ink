import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '@app/components/color-picker/color';
import { HexColors } from '@app/constants/hex-colors';

@Component({
    selector: 'app-color-textbox',
    templateUrl: './color-textbox.component.html',
    styleUrls: ['./color-textbox.component.scss'],
})
export class ColorTextboxComponent {
    @Input()
    hex: string;

    @Output()
    hexColorChangeEvent: EventEmitter<Color> = new EventEmitter<Color>();

    validateSizeHex(hex: string): string {
        if (hex.length < HexColors.LENGTH) return HexColors.INVALID;

        return hex;
    }

    onChange(hex: string): void {
        this.hex = this.validateSizeHex(hex);
        console.log(`Input ${hex}`);
        console.log(`Value it should be ${this.hex}`);
        const color = Color.hexToRgb(this.hex);
        this.hexColorChangeEvent.emit(color);
    }

    preventInvalid(key: KeyboardEvent) {
        const regularExpression = /[0-9A-Fa-f]{1}/g;
        if (!regularExpression.test(key.key)) key.preventDefault();
    }
}
