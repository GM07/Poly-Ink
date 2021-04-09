import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
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

  constructor(public textService: TextService) { 
    super();
    this.fonts = ['Arial', 'Times New Roman', 'Cursive', 'Fantasy', 'Monospace'];
  }

  colorSliderLabel(value: number): string {
    return value + 'px';
  }

  toggleItalic(): void {
    //TODO
    //this.textService.toggleItalic();
  }
  
  toggleBold(): void {
    //TODO
    //this.textService.toggleBold();
  }

  changeFont(newFont: string): void {
    //TODO
    //this.textService.changeFont(newFont);
  }

  changeFontSize(newFontSize: number): void {
    //TODO
    //this.textService.changeFontSize(newFontSize);
  }

  setAlignment(alignment: string) {
    //TODO
    //this.textService.changeTextAlign(alignment);
  }
}
