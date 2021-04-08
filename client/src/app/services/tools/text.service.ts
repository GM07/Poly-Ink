import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
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
      if(event.key === 'Enter') {
        const text = this.config.textData[this.config.index.y];
        const mathMin = Math.min(this.config.index.x, this.config.textData[this.config.index.y].length);
        let right = text.substring(mathMin);
        console.log(right);
        this.config.textData[this.config.index.y] = this.config.textData[this.config.index.y].substring(0, this.config.index.x);
        this.config.index.x = 0;
        this.config.index.y++;
        this.config.textData.push(right);
      } else {
        let left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
        let right = this.config.textData[this.config.index.y].slice(this.config.index.x, this.config.textData[this.config.index.y].length);
        
        if(event.key === 'Shift') this.handleShift(left, right);
        this.config.textData[this.config.index.y] = left.concat(event.key, right);
        this.config.index.x += 1;
      }
    }
  }

  handleShift(leftData: string, rightData: string): void {
    //TODO
  }

  delete(index: number): void {
    if(index !== 0) this.config.textData.splice(index - 1 , 1);
  }

  confirmText(): void {
    this.config.hasInput = false;
    this.config.index = new Vec2(0, 0);
    this.draw();
    this.config.textData = [];
  }

  handleArrowKeys(event: KeyboardEvent) {
    event.key === 'ArrowLeft' ? --this.config.index.x : ++this.config.index.x ;
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
