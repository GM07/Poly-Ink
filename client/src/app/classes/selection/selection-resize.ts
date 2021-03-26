import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { Geometry } from '../math/geometry';
import { Vec2 } from '../vec2';

export class SelectionResize {
    private readonly FLIP_IMAGE_FACTOR = -1;

    private config: SelectionConfig;
    private oppositeSide: Vec2;
    private resizeOrigin: Vec2;
    private memoryCanvas: HTMLCanvasElement | undefined;
    private lockVertical: boolean;
    private lockHorizontal: boolean;

    resizeSelected: boolean;
    updateSelectionRequest: Subject<Vec2>;

    constructor(config: SelectionConfig) {
        this.config = config;
        this.oppositeSide = { x: 0, y: 0 } as Vec2;
        this.resizeOrigin = { x: 0, y: 0 } as Vec2;
        this.resizeSelected = false;
        this.updateSelectionRequest = new Subject<Vec2>();
        this.memoryCanvas = undefined;
        this.lockVertical = false;
        this.lockHorizontal = false;
    }

    stopDrawing() {
        this.oppositeSide = { x: 0, y: 0 } as Vec2;
        this.resizeOrigin = { x: 0, y: 0 } as Vec2;
        this.config.scaleFactor = { x: 1, y: 1 } as Vec2;
        this.resizeSelected = false;
        this.memoryCanvas = undefined;
        this.lockVertical = false;
        this.lockHorizontal = false;
    }

    resize(mousePos: Vec2): void {
        if (this.config.selectionCtx === null || this.memoryCanvas == undefined) return;
        const translation = this.getTranslation(mousePos);
        const newSize = this.getNewSize(translation);

        if (Geometry.roundTowardsZero(newSize.x) === 0 || Geometry.roundTowardsZero(newSize.y) === 0) return;

        if (this.shouldFlipHorizontally(mousePos)) {
            this.flipHorizontal();
        }
        if (this.shouldFlipVertically(mousePos)) {
            this.flipVertical();
        }

        this.config.width = newSize.x;
        this.config.height = newSize.y;
        const canvas = this.config.selectionCtx.canvas;
        canvas.width = newSize.x;
        canvas.height = newSize.y;
        this.config.selectionCtx.drawImage(this.memoryCanvas, 0, 0, newSize.x, newSize.y);
        this.updateSelectionRequest.next(this.getTranslationForResize(mousePos));

        this.resizeOrigin.x += translation.x;
        this.resizeOrigin.y += translation.y;
    }

    topLeftResize(): void {
        const resizeOriginOffset = { x: 0, y: 0 } as Vec2;
        const oppositeSideOffset = { x: Math.abs(this.config.width), y: Math.abs(this.config.height) } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    topMiddleResize(): void {
        const resizeOriginOffset = { x: Math.abs(this.config.width / 2), y: 0 } as Vec2;
        const oppositeSideOffset = { x: Math.abs(this.config.width / 2), y: Math.abs(this.config.height) } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockHorizontal = true;
    }

    topRightResize(): void {
        const resizeOriginOffset = { x: Math.abs(this.config.width), y: 0 } as Vec2;
        const oppositeSideOffset = { x: 0, y: Math.abs(this.config.height) } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    middleLeftResize(): void {
        const resizeOriginOffset = { x: 0, y: Math.abs(this.config.height / 2) } as Vec2;
        const oppositeSideOffset = { x: Math.abs(this.config.width), y: Math.abs(this.config.height / 2) } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockVertical = true;
    }

    middleRightResize(): void {
        const resizeOriginOffset = { x: Math.abs(this.config.width), y: Math.abs(this.config.height / 2) } as Vec2;
        const oppositeSideOffset = { x: 0, y: Math.abs(this.config.height / 2) } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockVertical = true;
    }

    bottomLeftResize(): void {
        const resizeOriginOffset = { x: 0, y: Math.abs(this.config.height) } as Vec2;
        const oppositeSideOffset = { x: Math.abs(this.config.width), y: 0 } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    bottomMiddleResize(): void {
        const resizeOriginOffset = { x: Math.abs(this.config.width / 2), y: Math.abs(this.config.height) } as Vec2;
        const oppositeSideOffset = { x: Math.abs(this.config.width / 2), y: 0 } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockHorizontal = true;
    }

    bottomRightResize(): void {
        const resizeOriginOffset = { x: Math.abs(this.config.width), y: Math.abs(this.config.height) } as Vec2;
        const oppositeSideOffset = { x: 0, y: 0 } as Vec2;
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    private shouldFlipHorizontally(mousePos: Vec2): boolean {
        return (
            ((mousePos.x > this.oppositeSide.x && this.resizeOrigin.x < this.oppositeSide.x) ||
                (mousePos.x < this.oppositeSide.x && this.resizeOrigin.x > this.oppositeSide.x)) &&
            !this.lockHorizontal
        );
    }

    private shouldFlipVertically(mousePos: Vec2): boolean {
        return (
            ((mousePos.y > this.oppositeSide.y && this.resizeOrigin.y < this.oppositeSide.y) ||
                (mousePos.y < this.oppositeSide.y && this.resizeOrigin.y > this.oppositeSide.y)) &&
            !this.lockVertical
        );
    }

    private flipHorizontal(): void {
        if (this.config.selectionCtx === null || this.memoryCanvas === undefined) return;

        const tempCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(tempCanvas, this.memoryCanvas);
        this.config.scaleFactor.x *= this.FLIP_IMAGE_FACTOR;

        const ctx = this.memoryCanvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.scale(this.FLIP_IMAGE_FACTOR, 1);
        ctx.drawImage(tempCanvas, -tempCanvas.width, 0);
        ctx.restore();
    }

    private flipVertical(): void {
        if (this.config.selectionCtx === null || this.memoryCanvas === undefined) return;
        const tempCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(tempCanvas, this.memoryCanvas);
        this.config.scaleFactor.y *= this.FLIP_IMAGE_FACTOR;

        const ctx = this.memoryCanvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.scale(1, this.FLIP_IMAGE_FACTOR);
        ctx.drawImage(tempCanvas, 0, -tempCanvas.height);
        ctx.restore();
    }

    private getTranslationForResize(mousePos: Vec2): Vec2 {
        const translation = this.getTranslation(mousePos);
        let finalX = 0;
        let finalY = 0;
        if (!this.lockHorizontal) {
            if (this.resizeOrigin.x < this.oppositeSide.x) {
                const maxTranslation = this.oppositeSide.x - this.resizeOrigin.x - 1;
                finalX = translation.x > maxTranslation ? maxTranslation : translation.x;
            } else if (mousePos.x < this.oppositeSide.x) {
                finalX = mousePos.x - this.oppositeSide.x + 1;
            }
        }

        if (!this.lockVertical) {
            if (this.resizeOrigin.y < this.oppositeSide.y) {
                const maxTranslation = this.oppositeSide.y - this.resizeOrigin.y - 1;
                finalY = translation.y > maxTranslation ? maxTranslation : translation.y;
            } else if (mousePos.y < this.oppositeSide.y) {
                finalY = mousePos.y - this.oppositeSide.y + 1;
            }
        }

        return { x: finalX, y: finalY } as Vec2;
    }

    private initResize(resizeOriginOffset: Vec2, oppositeSideOffset: Vec2): void {
        if (this.config.selectionCtx === null) return;

        this.resizeOrigin.x = this.config.endCoords.x + resizeOriginOffset.x;
        this.resizeOrigin.y = this.config.endCoords.y + resizeOriginOffset.y;
        this.oppositeSide.x = this.config.endCoords.x + oppositeSideOffset.x;
        this.oppositeSide.y = this.config.endCoords.y + oppositeSideOffset.y;

        this.resizeSelected = true;
        this.lockHorizontal = false;
        this.lockVertical = false;
        if (this.memoryCanvas === undefined) {
            this.memoryCanvas = document.createElement('canvas');
            DrawingService.saveCanvas(this.memoryCanvas, this.config.selectionCtx.canvas);
        }
    }

    private getTranslation(mousePos: Vec2): Vec2 {
        const translationX = this.lockHorizontal ? 0 : Math.round(mousePos.x - this.resizeOrigin.x);
        const translationY = this.lockVertical ? 0 : Math.round(mousePos.y - this.resizeOrigin.y);
        return {
            x: translationX,
            y: translationY,
        } as Vec2;
    }

    private getNewSize(translation: Vec2): Vec2 {
        return {
            x: Math.abs(Math.abs(this.config.width) - translation.x * Math.sign(this.oppositeSide.x - this.resizeOrigin.x)),
            y: Math.abs(Math.abs(this.config.height) - translation.y * Math.sign(this.oppositeSide.y - this.resizeOrigin.y)),
        } as Vec2;
    }
}
