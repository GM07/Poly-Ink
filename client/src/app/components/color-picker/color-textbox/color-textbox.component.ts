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
    hexChangeEvent: EventEmitter<Color> = new EventEmitter<Color>();

    cleanHex(hex: string): string {
        // Remove pound sign if there is one
        if (hex[0] === '#') {
            hex = hex.substring(1);
        }

        if (hex.length > HexColors.LENGTH) return HexColors.INVALID;

        const regularExpression = /[0-9A-Fa-f]{6}/g;

        if (regularExpression.test(hex)) return hex;

        return HexColors.INVALID;
    }

    onChange(hex: string): void {
        this.hex = this.cleanHex(hex);
        const color = Color.hexToRgb(this.hex);
        this.hexChangeEvent.emit(color);
    }
}
