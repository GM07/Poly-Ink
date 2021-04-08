import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class TextService extends Tool {
  config: TextConfig;

  constructor(public drawingService: DrawingService, public colorService: ColorService) {
    super(drawingService, colorService);

    this.shortcutKey = new ShortcutKey(TextToolConstants.SHORTCUT_KEY);
    this.toolID = TextToolConstants.TOOL_ID;

    this.config = new TextConfig();
  }

  onKeyDown(event: KeyboardEvent): void {
    if(this.config.hasInput) {
      this.insert(event);
      this.drawPreview();
    }
  }

  insert(event: KeyboardEvent): void {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') this.handleArrowKeys(event);
    else { 
      let left = this.config.textData.slice(0, this.config.index);
      let right = this.config.textData.slice(this.config.index, this.config.textData.length);

      if(event.key === 'Shift') this.handleShift(left, right);
      this.config.textData = left.concat(event.key, right);
      this.config.index++;
    }
  }

  handleShift(leftData: string[], rightData: string[]): void {
    //TODO
  }

  delete(index: number): void {
    if(index !== 0) this.config.textData.splice(index - 1 , 1);
  }

  confirmText(): void {
    this.config.hasInput = false;
    this.draw();
    this.config.textData = [];
  }

  handleArrowKeys(event: KeyboardEvent) {
    this.config.index = event.key === 'ArrowLeft' ? --this.config.index : ++this.config.index ;
  }

  drawPreview(): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.drawPreview(command);
  }

  draw(): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.draw(command);
  }
}
