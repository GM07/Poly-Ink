import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class TextService extends Tool {
  config: TextConfig;
  hasInput: boolean;

  constructor(public drawingService: DrawingService, public colorService: ColorService) {
    super(drawingService, colorService);

    this.config = new TextConfig();
    this.hasInput = false;
  }

  insert(index: number, event: KeyboardEvent): void {
    let left = this.config.textData.slice(0, index);
    let right = this.config.textData.slice(index, this.config.textData.length);

    if(event.key === 'Shift') this.handleShift(index, left, right);
    this.config.textData = left.concat(event.key, right);
  }

  handleShift(index: number, leftData: string[], rightData: string[]): void {
    //TODO
  }

  delete(index: number): void {
    if(index !== 0) this.config.textData.splice(index - 1 , 1);
  }

  confirmText(): void {
    //TODO
  }

  drawPreview(): void {
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.drawPreview(command);
  }

  draw(): void {
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.draw(command);
  }
}
