import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-hex-textbox',
    templateUrl: './hex-textbox.component.html',
    styleUrls: ['./hex-textbox.component.scss'],
})
export class HexTextboxComponent {
    @Input()
    hex: string;

    @Input()
    length: number;

    @Input()
    label: string;

    @Output()
    hexChangeEvent: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();

    validateSizeHex(hex: string): string {
        if (hex.length < this.length) {
            for (let i = 0; i < this.length; i++) hex += '0';
        }

        return hex;
    }

    onChange(hex: string): void {
        this.hex = this.validateSizeHex(hex);
        this.hexChangeEvent.emit([this.label, this.hex]);
    }

    preventInvalid(key: KeyboardEvent) {
        const regularExpression = /[0-9A-Fa-f]{1}/g;
        if (!regularExpression.test(key.key)) key.preventDefault();
    }
}
