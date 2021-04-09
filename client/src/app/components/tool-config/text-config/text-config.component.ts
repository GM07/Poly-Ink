import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { TextService } from '@app/services/tools/text.service';

@Component({
  selector: 'app-text-config',
  templateUrl: './text-config.component.html',
  styleUrls: ['./text-config.component.scss']
})
export class TextConfigComponent extends ToolConfig {
  fonts: string[];
  readonly MIN: number = ToolSettingsConst.TEXT_MIN_FONT_SIZE;
  readonly MAX: number = ToolSettingsConst.TEXT_MAX_FONT_SIZE;

  constructor(public textService: TextService, public shortcutHandlerService: ShortcutHandlerService) { 
    super();
    this.fonts = ['Arial', 'Times New Roman', 'Cursive', 'Fantasy', 'Monospace'];
  }

  colorSliderLabel(value: number): string {
    return value + 'px';
  }

  toggleItalic(): void {
    this.shortcutHandlerService.blockShortcuts = true;
    this.textService.config.italic = !this.textService.config.italic;
  }
  
  toggleBold(): void {
    this.shortcutHandlerService.blockShortcuts = true;
    this.textService.config.bold = !this.textService.config.bold;
  }

  setAlignment(alignment: string) {
    //TODO
    //this.textService.changeTextAlign(alignment);
  }
}
