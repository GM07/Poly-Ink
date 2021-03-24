import { Injectable } from '@angular/core';
import { Geometry } from '@app/classes/math/geometry';
import { SelectionTranslation } from '@app/classes/selection/selection-translation';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
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
    protected readonly LINE_DASH: number = 8;
    protected readonly BORDER_WIDTH: number = 2;
    private readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    private readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    protected readonly SHIFT: ShortcutKey = new ShiftKey();
    protected selectionData: HTMLCanvasElement;
    protected selectionTranslation: SelectionTranslation;

    updatePoints: Subject<boolean>;
    mouseUpCoord: Vec2;
    config: SelectionConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.config = new SelectionConfig();
        this.selectionTranslation = new SelectionTranslation(this.config);
        this.selectionData = document.createElement('canvas');
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
        this.initSubscriptions();
        this.updatePoints = new Subject<boolean>();
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
            // document.body.style.width = this.bodyWidth;
            // document.body.style.height = this.bodyHeight;
            this.selectionTranslation.stopDrawing();
            this.endSelection();
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
        if (this.leftMouseDown) {
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
        } else if (this.SHIFT.equals(event)) {
            this.config.shiftDown = true;
            if (this.leftMouseDown && this.config.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        }
        this.selectionTranslation.onKeyDown(event, this.leftMouseDown);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = false;
            if (this.leftMouseDown && this.config.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        }
        this.selectionTranslation.onKeyUp(event);
    }

    selectAll(): void {
        this.selectionTranslation.stopDrawing();
        this.endSelection();
        this.leftMouseDown = false;
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        this.mouseUpCoord = { x: width, y: height } as Vec2;
        this.config.width = width;
        this.config.height = height;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.startSelection();
        this.updatePoints.next(true);
    }

    // isInSelection(event: MouseEvent): boolean {
    //     if (this.config.selectionCtx === null) return false;

    //     const left = this.config.endCoords.x;
    //     const right = this.config.endCoords.x + Math.abs(this.config.width);
    //     const top = this.config.endCoords.y;
    //     const bottom = this.config.endCoords.y + Math.abs(this.config.height);

    //     const currentPos = this.getPositionFromMouse(event);
    //     return currentPos.x >= left && currentPos.x <= right && currentPos.y >= top && currentPos.y <= bottom;
    // }

    stopDrawing(): void {
        this.drawingService.unblockUndoRedo();
        this.endSelection();
        this.leftMouseDown = false;
        this.config.shiftDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.selectionTranslation.stopDrawing();
        this.updatePoints.next(false);
    }

    startMouseTranslation(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) this.selectionTranslation.startMouseTranslation(this.getPositionFromMouse(event));
    }

    private setMouseUpCoord(event: MouseEvent): void {
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

    private initSubscriptions(): void {
        this.drawingService.changes.subscribe(() => {
            this.updateSelection({ x: 0, y: 0 } as Vec2);
        });
        this.selectionTranslation.updateSelectionRequest.subscribe((translation: Vec2) => {
            this.updateSelection(translation);
        });
    }

    private startSelection(): void {
        if (Geometry.roundTowardsZero(this.config.width) === 0 || Geometry.roundTowardsZero(this.config.height) === 0) {
            this.drawingService.unblockUndoRedo();
            return;
        }
        this.selectionData.width = Math.abs(this.config.width);
        this.selectionData.height = Math.abs(this.config.height);
        this.config.selectionCtx = this.selectionData.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.config.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.config.height);
        this.config.endCoords = { x, y } as Vec2;
        this.config.startCoords = { x, y } as Vec2;

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
        this.config.endCoords.x += translation.x;
        this.config.endCoords.y += translation.y;
        this.updateSelectionRequired();
        this.updatePoints.next(true);
    }

    private drawPreviewSelection(): void {
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
