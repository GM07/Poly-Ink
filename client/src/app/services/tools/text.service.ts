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
  delete: ShortcutKey = new ShortcutKey('delete');
  backspace: ShortcutKey = new ShortcutKey('backspace');
  escape: ShortcutKey = new ShortcutKey('escape');
  arrowLeft: ShortcutKey = new ShortcutKey('arrowleft');
  arrowRight: ShortcutKey = new ShortcutKey('arrowright');
  arrowUp: ShortcutKey = new ShortcutKey('arrowup');
  arrowDown: ShortcutKey = new ShortcutKey('arrowdown');
  shortcutList: ShortcutKey[] = [this.delete, this.backspace, this.escape, this.arrowLeft, this.arrowRight, this.arrowUp, this.arrowDown];

  constructor(public drawingService: DrawingService, public colorService: ColorService) {
    super(drawingService, colorService);

    this.shortcutKey = new ShortcutKey(TextToolConstants.SHORTCUT_KEY);
    this.toolID = TextToolConstants.TOOL_ID;

    this.config = new TextConfig();
  }
  
  onKeyDown(event: KeyboardEvent): void {
    const shortcut = ShortcutKey.get(this.shortcutList, event, true);
    if (shortcut !== undefined) {
      event.preventDefault();
      this.handleShortCuts(shortcut);
    } else if(this.config.hasInput) {
      this.insert(event);
    }
    this.drawPreview();
  }
  
  insert(event: KeyboardEvent): void {
    if(event.key === 'Enter') {
      const text = this.config.textData[this.config.index.y];
      const mathMin = Math.min(this.config.index.x, this.config.textData[this.config.index.y].length);
      let right = text.substring(mathMin);
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

  handleShift(leftData: string, rightData: string): void {
    //TODO
  }

  confirmText(): void {
    this.config.hasInput = false;
    this.draw();
    this.config.index.x = 0;
    this.config.index.y = 0;
    this.config.textData = [''];
  }
  
  private handleShortCuts(shortcutKey: ShortcutKey) {
    switch (shortcutKey) {
      case this.delete:
        this.handleDelete();
        break;
      case this.backspace:
        this.handleBackspace();
        break;
      case this.escape:
        this.handleEscape();
        break;
      case this.arrowLeft:
        this.handleArrowLeft();
        break;
      case this.arrowRight:
        this.handleArrowRight();
        break;
      case this.arrowUp:
        this.handleArrowUp();
        break;
      case this.arrowDown:
        this.handleArrowDown();
      default:
        break;
    }
  }
      
  private handleDelete(): void {
    let x = this.config.index.x;
    let y = this.config.index.y;
    let text = this.config.textData;
    if(x === text[y].length) return;
    if(x < text[y].length) {
      text[y] = text[y].substring(0, x) + text[y].substring(x + 1);
    }
  }
  
  private handleBackspace(): void {
    let x = this.config.index.x;
    let y = this.config.index.y;
    let text = this.config.textData;
    if(y === 0 && x === 0) return;
    if(x === 0) this.config.index.x = text[--this.config.index.y].length;
    if(x > 0) {
      text[y] = text[y].substring(0, x - 1) + text[y].substring(x);
      this.config.index.x--;
    }
  }

  private handleEscape(): void {
    this.config.textData = [''];
    this.config.hasInput = false;
    this.config.index.x = 0;
    this.config.index.y = 0;
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.drawingService.unblockUndoRedo();
  }

  private handleArrowLeft(): void {
    if(this.config.index.y === 0 && this.config.index.x === 0) return;
    if(this.config.index.x > 0) --this.config.index.x;
    else this.config.index.x = this.config.textData[--this.config.index.y].length;
  }
  
  private handleArrowRight(): void {
    let x = this.config.index.x;
    let y = this.config.index.y;
    let text = this.config.textData;
    if(y === text.length - 1 && this.config.index.x === text[y].length) return;
    if(x < text[y].length) ++this.config.index.x;
    else {
      this.config.index.x = 0;
      this.config.index.y++;
    }
  }
  
  private handleArrowUp(): void {
    let x = this.config.index.x;
    let y = this.config.index.y;
    let text = this.config.textData;
    if(y === 0) return;
    this.config.index.y--;
    this.config.index.x = Math.min(x, text[y].length);
  }

  private handleArrowDown(): void {
    let x = this.config.index.x;
    let y = this.config.index.y;
    let text = this.config.textData;
    if(y === text.length - 1) return;
    this.config.index.y++;
    this.config.index.x = Math.min(x, text[y].length);
  }

  drawPreview(): void {
    //this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.drawPreview(command);
  }

  draw(): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const command = new TextDraw(this.colorService, this.config);
    this.drawingService.draw(command);
  }
}
