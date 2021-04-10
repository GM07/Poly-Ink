import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    config: TextConfig;

    delete: ShortcutKey;
    backspace: ShortcutKey;
    escape: ShortcutKey;
    arrowLeft: ShortcutKey;
    arrowRight: ShortcutKey;
    arrowUp: ShortcutKey;
    arrowDown: ShortcutKey;
    shortcutList: ShortcutKey[];

    shift: ShortcutKey;
    alt: ShortcutKey;
    tab: ShortcutKey;
    capslock: ShortcutKey;
    control: ShortcutKey;
    meta: ShortcutKey;
    ignoreShortcutList: ShortcutKey[];

    constructor(public drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(TextToolConstants.SHORTCUT_KEY);
        this.toolID = TextToolConstants.TOOL_ID;

        this.config = new TextConfig();

        this.delete = new ShortcutKey('delete');
        this.backspace = new ShortcutKey('backspace');
        this.escape = new ShortcutKey('escape');
        this.arrowLeft = new ShortcutKey('arrowleft');
        this.arrowRight = new ShortcutKey('arrowright');
        this.arrowUp = new ShortcutKey('arrowup');
        this.arrowDown = new ShortcutKey('arrowdown');
        this.shortcutList = [this.delete, this.backspace, this.escape, this.arrowLeft, this.arrowRight, this.arrowUp, this.arrowDown];

        this.shift = new ShortcutKey('shift');
        this.alt = new ShortcutKey('alt');
        this.tab = new ShortcutKey('tab');
        this.capslock = new ShortcutKey('capslock');
        this.control = new ShortcutKey('control');
        this.meta = new ShortcutKey('meta');
        this.ignoreShortcutList = [this.shift, this.alt, this.tab, this.capslock, this.control, this.meta];
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === ' ') event.preventDefault();
        const shortcut = ShortcutKey.get(this.shortcutList, event, true);
        if (shortcut !== undefined) {
            event.preventDefault();
            this.handleShortCuts(shortcut);
        } else if (this.config.hasInput) {
            this.insert(event);
        }
        this.drawPreview();
    }

    insert(event: KeyboardEvent): void {
        const shortcut = ShortcutKey.get(this.ignoreShortcutList, event, true);
        if (shortcut !== undefined) return;
        if (event.key === 'Enter') {
            const right = this.config.textData[this.config.index.y].substring(
                Math.min(this.config.index.x, this.config.textData[this.config.index.y].length),
            );
            this.config.textData[this.config.index.y] = this.config.textData[this.config.index.y].substring(0, this.config.index.x);
            this.config.index.x = 0;
            this.config.index.y++;
            this.config.textData.push(right);
        } else {
            const left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
            const right = this.config.textData[this.config.index.y].slice(this.config.index.x, this.config.textData[this.config.index.y].length);

            this.config.textData[this.config.index.y] = left.concat(event.key, right);
            this.config.index.x += 1;
        }
    }

    confirmText(): void {
        this.config.hasInput = false;
        this.draw();
        this.config.index.x = 0;
        this.config.index.y = 0;
        this.config.textData = [''];
    }

    private handleShortCuts(shortcutKey: ShortcutKey): void {
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
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (x === text[y].length) return;
        if (x < text[y].length) {
            text[y] = text[y].substring(0, x) + text[y].substring(x + 1);
        }
    }

    private handleBackspace(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (y === 0 && x === 0) return;
        if (x === 0) this.config.index.x = text[--this.config.index.y].length;
        if (x > 0) {
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
        if (this.config.index.y === 0 && this.config.index.x === 0) return;
        if (this.config.index.x > 0) --this.config.index.x;
        else this.config.index.x = this.config.textData[--this.config.index.y].length;
    }

    private handleArrowRight(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (y === text.length - 1 && this.config.index.x === text[y].length) return;
        if (x < text[y].length) ++this.config.index.x;
        else {
            this.config.index.x = 0;
            this.config.index.y++;
        }
    }

    private handleArrowUp(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (y === 0) return;
        this.config.index.y--;
        this.config.index.x = Math.min(x, text[y].length);
    }

    private handleArrowDown(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (y === text.length - 1) return;
        this.config.index.y++;
        this.config.index.x = Math.min(x, text[y].length);
    }

    drawPreview(): void {
        const command = new TextDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    draw(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const command = new TextDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
