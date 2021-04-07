import { Injectable } from '@angular/core';
import { Geometry } from '@app/classes/math/geometry';
import { SelectionResize } from '@app/classes/selection/selection-resize';
import { SelectionTranslation } from '@app/classes/selection/selection-translation';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractSelectionService extends Tool {
    static readonly LINE_DASH: number = 8;
    static readonly BORDER_WIDTH: number = 2;

    private readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    private readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    protected readonly LINE_DASH: number = 8;
    protected readonly BORDER_WIDTH: number = 2;
    protected selectionTranslation: SelectionTranslation;

    readonly UPDATE_POINTS: Subject<boolean> = new Subject<boolean>();
    selectionResize: SelectionResize;
    mouseUpCoord: Vec2;
    config: SelectionConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.initAttribs(new SelectionConfig());
    }

    initAttribs(config: SelectionConfig): void {
        this.config = config;
        this.selectionTranslation = new SelectionTranslation(this.config, this.drawingService.magnetismService);
        this.selectionResize = new SelectionResize(this.config);
        this.config.endCoords = new Vec2(0, 0);
        this.initSubscriptions();
    }

    protected abstract endSelection(): void;

    protected abstract fillBackground(ctx: CanvasRenderingContext2D): void;

    protected abstract updateSelectionRequired(): void;

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            this.endSelection();
            this.selectionResize.stopDrawing();
            this.selectionTranslation.stopDrawing();
            this.UPDATE_POINTS.next(false);
            this.mouseDownCoord = mousePos;
            this.mouseUpCoord = mousePos;
            this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
            this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.config.previewSelectionCtx === null) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.startSelection();
            } else {
                this.selectionTranslation.onMouseUp(this.mouseUpCoord);
            }
        }
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.resizeSelected) {
            this.setMouseUpCoord(event);
            this.selectionResize.resize(this.getPositionFromMouse(event));
        } else if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.config.previewSelectionCtx === null) {
                const ctx = this.drawingService.previewCtx;
                this.drawingService.clearCanvas(ctx);
                this.drawPreviewSelection();
            } else {
                this.selectionTranslation.onMouseMove(event, this.mouseUpCoord);
            }
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.CANCEL_SELECTION.equals(event)) {
            this.stopDrawing();
        } else if (this.SELECT_ALL.equals(event) && !this.leftMouseDown) {
            event.preventDefault();
            this.selectAll();
        } else if (this.config.shift.equals(event)) {
            this.config.shift.isDown = true;
            if (this.leftMouseDown && this.config.previewSelectionCtx === null) {
                this.updateDrawingSelection();
            } else if (this.selectionResize.resizeSelected && !event.repeat) {
                this.selectionResize.resize(this.mouseUpCoord);
            }
        }
        this.selectionTranslation.onKeyDown(event, this.leftMouseDown);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.config.shift.equals(event)) {
            this.config.shift.isDown = false;
            if (this.leftMouseDown && this.config.previewSelectionCtx === null) {
                this.updateDrawingSelection();
            } else if (this.selectionResize.resizeSelected) {
                this.selectionResize.resize(this.mouseUpCoord);
            }
        }
        this.selectionTranslation.onKeyUp(event);
    }

    selectAll(): void {
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.leftMouseDown = false;
        this.config.endCoords = new Vec2(0, 0);
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = new Vec2(0, 0);
        this.mouseUpCoord = new Vec2(width, height);
        this.config.width = width;
        this.config.height = height;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.startSelection();
        this.UPDATE_POINTS.next(true);
    }

    stopDrawing(): void {
        this.drawingService.unblockUndoRedo();
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.leftMouseDown = false;
        this.config.shift.isDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.UPDATE_POINTS.next(false);
    }

    startMouseTranslation(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) this.selectionTranslation.startMouseTranslation(this.getPositionFromMouse(event));
    }

    get resizeSelected(): boolean {
        return this.selectionResize.resizeSelected;
    }

    set resizeSelected(selected: boolean) {
        this.selectionResize.resizeSelected = selected;
    }

    protected setMouseUpCoord(event: MouseEvent): void {
        if (this.leftMouseDown && this.config.previewSelectionCtx === null && !this.isInCanvas(event)) {
            const rect = this.drawingService.canvas.getBoundingClientRect();
            const mousePos: Vec2 = this.getPositionFromMouse(event);
            if (event.x >= rect.right) mousePos.x = this.drawingService.canvas.width;
            if (event.x <= rect.left) mousePos.x = 0;
            if (event.y <= rect.top) mousePos.y = 0;
            if (event.y >= rect.bottom) mousePos.y = this.drawingService.canvas.height;
            this.mouseUpCoord = mousePos;
        } else {
            this.mouseUpCoord = this.getPositionFromMouse(event);
        }
    }

    protected initSubscriptions(): void {
        this.drawingService.changes.subscribe(() => {
            this.updateSelection(new Vec2(0, 0));
        });
        this.selectionTranslation.UPDATE_SELECTION_REQUEST.subscribe((translation: Vec2) => {
            this.updateSelection(translation);
        });
        this.selectionResize.UPDATE_SELECTION_REQUEST.subscribe((translation: Vec2) => {
            this.updateSelection(translation);
        });
    }

    protected startSelection(): void {
        if (Geometry.roundTowardsZero(this.config.width) === 0 || Geometry.roundTowardsZero(this.config.height) === 0) {
            this.drawingService.unblockUndoRedo();
            return;
        }
        this.config.originalWidth = this.config.width;
        this.config.originalHeight = this.config.height;
        this.config.SELECTION_DATA.width = Math.abs(this.config.width);
        this.config.SELECTION_DATA.height = Math.abs(this.config.height);

        this.config.previewSelectionCtx = this.config.SELECTION_DATA.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.config.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.config.height);
        this.config.endCoords = new Vec2(x, y);
        this.config.startCoords = new Vec2(x, y);

        this.config.previewSelectionCtx.drawImage(
            this.drawingService.canvas,
            x,
            y,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
            0,
            0,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );

        this.updateSelection(new Vec2(0, 0));
    }

    updateSelection(translation: Vec2): void {
        if (this.config.previewSelectionCtx === null) return;

        this.drawingService.blockUndoRedo();
        this.config.endCoords = this.config.endCoords.add(translation);
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        if (!this.config.markedForPaste) {
            this.fillBackground(ctx);
        }

        this.updateSelectionRequired();
        this.UPDATE_POINTS.next(true);
    }

    protected drawPreviewSelection(): void {
        this.drawingService.blockUndoRedo();

        this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
    }

    private updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection();
    }
}
