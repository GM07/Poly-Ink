import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { HIGHLIGHTED_COLOR } from '@app/classes/tool_ui_settings/tools.constants';
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
    readonly MIN: number = ToolSettingsConst.TEXT_MIN_FONT_SIZE;
    readonly MAX: number = ToolSettingsConst.TEXT_MAX_FONT_SIZE;
    readonly HIGHLIGHTED_COLOR: string = HIGHLIGHTED_COLOR;
    currentFont: string;
    currentFontSize: number;

    constructor(public textService: TextService, public shortcutHandlerService: ShortcutHandlerService) {
        super();
        this.currentFont = textService.config.textFont;
        this.currentFontSize = textService.config.fontSize;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    toggleItalic(): void {
        this.textService.config.italic = !this.textService.config.italic;
        this.textService.drawPreview();
        this.unfocusElement();
    }

    toggleBold(): void {
        this.textService.config.bold = !this.textService.config.bold;
        this.textService.drawPreview();
        this.unfocusElement();
    }

    changeFont(newFont: string): void {
        this.textService.config.textFont = newFont;
        this.textService.drawPreview();
        this.currentFont = newFont;
        this.unfocusElement();
    }

    changeFontSize(newSize: number): void {
        this.textService.config.fontSize = newSize;
        this.textService.drawPreview();
        this.currentFontSize = newSize;
        this.unfocusElement();
    }

    setAlignment(newAlignment: string): void {
        if (this.textService.config.alignmentSetting !== newAlignment) {
            this.textService.config.newAlignment = true;
            this.textService.config.lastAlignment = this.textService.config.alignmentSetting;
            this.textService.config.alignmentSetting = newAlignment;
            this.textService.drawPreview();
            this.textService.config.newAlignment = false;
        }
        this.unfocusElement();
    }

    private unfocusElement(): void {
        (document.activeElement as HTMLElement).blur();
    }
}
