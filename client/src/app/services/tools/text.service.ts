import { Injectable } from '@angular/core';
import { TextDraw } from '@app/classes/commands/text-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { TextConfig } from '@app/classes/tool-config/text-config';
import { TextToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private static readonly delete: ShortcutKey = new ShortcutKey('delete');
    private static readonly backspace: ShortcutKey = new ShortcutKey('backspace');
    private static readonly escape: ShortcutKey = new ShortcutKey('escape');
    private static readonly arrowLeft: ShortcutKey = new ShortcutKey('arrowleft');
    private static readonly arrowRight: ShortcutKey = new ShortcutKey('arrowright');
    private static readonly arrowUp: ShortcutKey = new ShortcutKey('arrowup');
    private static readonly arrowDown: ShortcutKey = new ShortcutKey('arrowdown');
    readonly BLOCK_SHORTCUTS: Subject<boolean> = new Subject<boolean>();

    config: TextConfig;
    shortcutList: ShortcutKey[];
    ignoreShortcutList: ShortcutKey[];

    constructor(public drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(TextToolConstants.SHORTCUT_KEY);
        this.toolID = TextToolConstants.TOOL_ID;

        this.config = new TextConfig();

        this.shortcutList = [
            TextService.delete,
            TextService.backspace,
            TextService.escape,
            TextService.arrowLeft,
            TextService.arrowRight,
            TextService.arrowUp,
            TextService.arrowDown,
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
        if (event.key === 'Enter') {
            const right = this.config.textData[this.config.index.y].substring(
                Math.min(this.config.index.x, this.config.textData[this.config.index.y].length),
            );
            this.config.textData[this.config.index.y] = this.config.textData[this.config.index.y].substring(0, this.config.index.x);
            this.config.index.x = 0;
            this.config.index.y++;
            this.config.textData.push(right);
        } else if (event.key.length > 1) return;
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
    }

    private handleShortCuts(shortcutKey: ShortcutKey): void {
        switch (shortcutKey) {
            case TextService.delete:
                this.handleDelete();
                break;
            case TextService.backspace:
                this.handleBackspace();
                break;
            case TextService.escape:
                this.handleEscape();
                break;
            case TextService.arrowLeft:
                this.handleArrowLeft();
                break;
            case TextService.arrowRight:
                this.handleArrowRight();
                break;
            case TextService.arrowUp:
                this.handleArrowUp();
                break;
            case TextService.arrowDown:
                this.handleArrowDown();
        }
    }

    private handleDelete(): void {
        const x = this.config.index.x;
        const y = this.config.index.y;
        const text = this.config.textData;
        if (x === 0 && y > 0 && text[y].length === 0) this.config.index.x = this.config.textData[--this.config.index.y].length;
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
