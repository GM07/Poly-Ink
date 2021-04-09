import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { TextService } from '@app/services/tools/text.service';
import { Subscription } from 'rxjs';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  private leftMouseDown: boolean;
  private readonly ESCAPE: ShortcutKey = new ShortcutKey('escape');
  public subscriptionIconClick: Subscription;

  @ViewChild('textBox', { static: false }) textBox: ElementRef<HTMLTextAreaElement>;

  constructor(public textService: TextService, public shortcutHandlerService: ShortcutHandlerService, public drawingService: DrawingService, public colorService: ColorService) {
    this.ESCAPE.isDown = false;
  }

  ngOnInit() {
    this.subscriptionIconClick = this.textService.handleIconClicked.subscribe(() => {
      this.confirmText();
    });
  }

  onMouseDown(event: MouseEvent): void {
    this.leftMouseDown = event.button === MouseButton.Left;
    if (this.textService.isInCanvas(event) && this.leftMouseDown && !this.colorService.isMenuOpen) {
      this.textService.config.hasInput ? this.confirmText() : this.addText(event);
    }
  }

  confirmText(): void {
    this.textService.confirmText();
    this.shortcutHandlerService.blockShortcuts = false;
  }

  addText(event: MouseEvent) {
    this.shortcutHandlerService.blockShortcuts = true;
    this.textService.config.hasInput = true;
    this.textService.config.startCoords.x = event.offsetX;
    this.textService.config.startCoords.y = event.offsetY;
    this.textService.drawPreview();
  }
}

