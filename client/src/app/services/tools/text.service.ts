import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private static readonly DELETE: ShortcutKey = new ShortcutKey('delete');
    private static readonly BACKSPACE: ShortcutKey = new ShortcutKey('backspace');
    private static readonly ESCAPE: ShortcutKey = new ShortcutKey('escape');
    private static readonly ARROW_LEFT: ShortcutKey = new ShortcutKey('arrowleft');
    private static readonly ARROW_RIGHT: ShortcutKey = new ShortcutKey('arrowright');
    private static readonly ARROW_UP: ShortcutKey = new ShortcutKey('arrowup');
    private static readonly ARROW_DOWN: ShortcutKey = new ShortcutKey('arrowdown');
    readonly BLOCK_SHORTCUTS: Subject<boolean> = new Subject<boolean>();

    config: TextConfig;
    shortcutList: ShortcutKey[];
    ignoreShortcutList: ShortcutKey[];

    constructor(public drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(TextToolConstants.SHORTCUT_KEY);
        this.toolID = TextToolConstants.TOOL_ID;

        this.config = new TextConfig();

        // To allow instance initialization longer than 150 characters
        // tslint:disable-next-line
        this.shortcutList = [
            TextService.DELETE,
            TextService.BACKSPACE,
            TextService.ESCAPE,
            TextService.ARROW_LEFT,
            TextService.ARROW_RIGHT,
            TextService.ARROW_UP,
            TextService.ARROW_DOWN,
        ];
        this.initSubscriptions();
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.config.hasInput ? this.confirmText() : this.addText(event);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.config.hasInput) return;

        if (event.key === ' ') event.preventDefault();
        const shortcut = ShortcutKey.get(this.shortcutList, event, true);
        if (shortcut !== undefined) {
            event.preventDefault();
            this.handleShortCuts(shortcut);
        } else {
            this.insert(event);
        }
        this.drawPreview();
    }

    insert(event: KeyboardEvent): void {
        if (event.key === 'Enter') this.handleEnter();
        else if (event.key.length > 1) return;
        else {
            const left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
            const right = this.config.textData[this.config.index.y].slice(this.config.index.x, this.config.textData[this.config.index.y].length);

            this.config.textData[this.config.index.y] = left.concat(event.key, right);
            this.config.index.x += 1;
        }
    }

    confirmText(): void {
        const lastInputStatus = this.config.hasInput;
        this.config.hasInput = false;
        if (lastInputStatus) this.draw();
        this.config.index.x = 0;
        this.config.index.y = 0;
        this.config.textData = [''];
        this.BLOCK_SHORTCUTS.next(false);
    }

    protected initSubscriptions(): void {
        this.drawingService.changes.subscribe(() => {
            if (this.config.hasInput) {
                this.drawPreview();
                this.BLOCK_SHORTCUTS.next(true);
                this.drawingService.blockUndoRedo();
            }
        });
        this.colorService.changedPrimary.subscribe(() => {
            this.drawPreview();
        });
    }

    private handleEnter(): void {
        const right = this.config.textData[this.config.index.y].substring(
            Math.min(this.config.index.x, this.config.textData[this.config.index.y].length),
        );
        this.config.textData[this.config.index.y] = this.config.textData[this.config.index.y].substring(0, this.config.index.x);
        this.config.index.x = 0;
        this.config.index.y++;
        this.config.textData.splice(this.config.index.y, 0, right);
    }

    private handleShortCuts(shortcutKey: ShortcutKey): void {
        switch (shortcutKey) {
            case TextService.DELETE:
                this.handleDelete();
                break;
            case TextService.BACKSPACE:
                this.handleBackspace();
                break;
            case TextService.ESCAPE:
                this.handleEscape();
                break;
            case TextService.ARROW_LEFT:
                this.handleArrowLeft();
                break;
            case TextService.ARROW_RIGHT:
                this.handleArrowRight();
                break;
            case TextService.ARROW_UP:
                this.handleArrowUp();
                break;
            case TextService.ARROW_DOWN:
                this.handleArrowDown();
        }
    }

    private handleDelete(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (x === 0 && y > 0 && text[y].length === 0) {
            if (y === text.length - 1) return;
            this.config.textData.splice(this.config.index.y, 1);
            return;
        }
        if (x === text[this.config.index.y].length) {
            if (this.config.index.y === text.length - 1) return;
            text[y] += text[y + 1];
            this.config.textData.splice(this.config.index.y + 1, 1);
            return;
        }
        if (x < text[this.config.index.y].length) {
            text[this.config.index.y] = text[this.config.index.y].substring(0, x) + text[this.config.index.y].substring(x + 1);
        }
    }

    private handleBackspace(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (y === 0 && x === 0) return;
        if (x === 0) {
            this.config.index.x = text[y - 1].length;
            text[y - 1] += text[y];
            this.config.textData.splice(this.config.index.y--, 1);
        }
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
        this.BLOCK_SHORTCUTS.next(false);
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
        if (this.config.index.y === 0) return;
        this.config.index.y--;
        this.config.index.x = Math.min(this.config.index.x, this.config.textData[this.config.index.y].length);
    }

    private handleArrowDown(): void {
        const text = this.config.textData;
        if (this.config.index.y === text.length - 1) return;
        this.config.index.y++;
        this.config.index.x = Math.min(this.config.index.x, text[this.config.index.y].length);
    }

    private addText(event: MouseEvent): void {
        this.BLOCK_SHORTCUTS.next(true);
        this.config.hasInput = true;
        this.config.startCoords.x = event.offsetX;
        this.config.startCoords.y = event.offsetY;
        this.drawPreview();
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

    stopDrawing(): void {
        this.confirmText();
    }
}
