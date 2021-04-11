import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-config',
    templateUrl: './text-config.component.html',
    styleUrls: ['./text-config.component.scss'],
})
export class TextConfigComponent extends ToolConfig {
    readonly fonts: string[] = ['Arial', 'Times New Roman', 'Cursive', 'Fantasy', 'Monospace'];
    readonly MIN: number = ToolSettingsConst.TEXT_MIN_FONT_SIZE;;
    readonly MAX: number = ToolSettingsConst.TEXT_MAX_FONT_SIZE;

    constructor(public textService: TextService, public shortcutHandlerService: ShortcutHandlerService) {
        super(); 
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    toggleItalic(): void {
        this.textService.config.italic = !this.textService.config.italic;
        this.textService.drawPreview();
    }

    toggleBold(): void {
        this.textService.config.bold = !this.textService.config.bold;
        this.textService.drawPreview();
    }

    changeFont(newFont: string): void {
        this.textService.config.textFont = newFont;
        this.textService.drawPreview();
    }

    changeFontSize(newSize: number): void {
        this.textService.config.fontSize = newSize;
        this.textService.drawPreview();
    }

    setAlignment(newAlignment: string): void {
        this.textService.config.alignmentSetting = newAlignment;
        this.textService.drawPreview();
    }
}
