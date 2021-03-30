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
    private readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    private readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    static readonly LINE_DASH: number = 8;
    static readonly BORDER_WIDTH: number = 2;
    protected selectionData: HTMLCanvasElement;
    protected selectionTranslation: SelectionTranslation;
    selectionResize: SelectionResize;

    updatePoints: Subject<boolean>;
    mouseUpCoord: Vec2;
    config: SelectionConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.config = new SelectionConfig();
        this.initSelection();
        this.updatePoints = new Subject<boolean>();
    }

    protected initSelection() {
        this.selectionTranslation = new SelectionTranslation(this.config);
        this.selectionResize = new SelectionResize(this.config);
        this.selectionData = document.createElement('canvas');
        this.config.endCoords = new Vec2(0, 0);
        this.initSubscriptions();
    }

    protected abstract endSelection(): void;

    protected abstract fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void;

    protected abstract updateSelectionRequired(): void;

    protected abstract drawPreviewSelectionRequired(): void;

    protected abstract drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void;

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            this.endSelection();
            this.selectionResize.stopDrawing();
            this.selectionTranslation.stopDrawing();
            this.updatePoints.next(false);
            this.mouseDownCoord = mousePos;
            this.mouseUpCoord = mousePos;
            this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
            this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.config.selectionCtx === null) {
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
            if (this.config.selectionCtx === null) {
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
            if (this.leftMouseDown && this.config.selectionCtx === null) {
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
            if (this.leftMouseDown && this.config.selectionCtx === null) {
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
        this.updatePoints.next(true);
    }

    stopDrawing(): void {
        this.drawingService.unblockUndoRedo();
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.leftMouseDown = false;
        this.config.shift.isDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.updatePoints.next(false);
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
        if (this.leftMouseDown && this.config.selectionCtx === null && !this.isInCanvas(event)) {
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
        this.selectionTranslation.updateSelectionRequest.subscribe((translation: Vec2) => {
            this.updateSelection(translation);
        });
        this.selectionResize.updateSelectionRequest.subscribe((translation: Vec2) => {
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
        this.selectionData.width = Math.abs(this.config.width);
        this.selectionData.height = Math.abs(this.config.height);
        this.config.selectionCtx = this.selectionData.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.config.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.config.height);
        console.log(x, y);
        this.config.endCoords = new Vec2(x, y);
        this.config.startCoords = new Vec2(x, y);

        this.config.selectionCtx.drawImage(
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

        const previewCtx = this.drawingService.previewCtx;
        previewCtx.drawImage(this.selectionData, x, y);

        this.drawPreviewSelection();
        this.updatePoints.next(true);
    }

    private updateSelection(translation: Vec2): void {
        if (this.config.selectionCtx === null) return;

        this.drawingService.blockUndoRedo();
        this.config.endCoords = this.config.endCoords.add(translation);
        this.updateSelectionRequired();
        this.updatePoints.next(true);
    }

    protected drawPreviewSelection(): void {
        this.drawingService.blockUndoRedo();

        this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;

        this.drawPreviewSelectionRequired();
    }

    private updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection();
    }
}
