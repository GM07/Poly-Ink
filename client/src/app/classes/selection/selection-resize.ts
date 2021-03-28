import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

export class SelectionResize {
    private readonly FLIP_IMAGE_FACTOR: number = -1;
    private readonly MINIMUM_RESIZE_SIZE: number = 1;

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
        this.updateSelectionRequest = new Subject<Vec2>();
        this.initAttribs();
    }

    stopDrawing(): void {
        this.initAttribs();
    }

    resize(mousePosIn: Vec2): void {
        if (this.config.selectionCtx === null || this.memoryCanvas == undefined) return;

        const mousePos = this.adaptMousePosition(mousePosIn);

        const newSize = this.getNewSize(mousePos);
        if (Math.abs(newSize.x) < this.MINIMUM_RESIZE_SIZE || Math.abs(newSize.y) < this.MINIMUM_RESIZE_SIZE) return;

        if (this.shouldFlipHorizontally(mousePos)) {
            this.flipHorizontal();
        }
        if (this.shouldFlipVertically(mousePos)) {
            this.flipVertical();
        }

        this.config.width = newSize.x;
        this.config.height = newSize.y;
        const canvas = this.config.selectionCtx.canvas;
        canvas.width = Math.abs(newSize.x);
        canvas.height = Math.abs(newSize.y);
        this.config.selectionCtx.drawImage(this.memoryCanvas, 0, 0, Math.abs(newSize.x), Math.abs(newSize.y));
        this.updateSelectionRequest.next(this.getTranslationForResize(mousePos));

        const translation = this.getTranslation(mousePos);
        this.resizeOrigin = this.resizeOrigin.add(translation);
    }

    topLeftResize(): void {
        const resizeOriginOffset = new Vec2(0, 0);
        const oppositeSideOffset = new Vec2(Math.abs(this.config.width), Math.abs(this.config.height));
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    topMiddleResize(): void {
        const resizeOriginOffset = new Vec2(Math.abs(this.config.width / 2), 0);
        const oppositeSideOffset = new Vec2(Math.abs(this.config.width / 2), Math.abs(this.config.height));
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockHorizontal = true;
    }

    topRightResize(): void {
        const resizeOriginOffset = new Vec2(Math.abs(this.config.width), 0);
        const oppositeSideOffset = new Vec2(0, Math.abs(this.config.height));
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    middleLeftResize(): void {
        const resizeOriginOffset = new Vec2(0, Math.abs(this.config.height / 2));
        const oppositeSideOffset = new Vec2(Math.abs(this.config.width), Math.abs(this.config.height / 2));
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockVertical = true;
    }

    middleRightResize(): void {
        const resizeOriginOffset = new Vec2(Math.abs(this.config.width), Math.abs(this.config.height / 2));
        const oppositeSideOffset = new Vec2(0, Math.abs(this.config.height / 2));
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockVertical = true;
    }

    bottomLeftResize(): void {
        const resizeOriginOffset = new Vec2(0, Math.abs(this.config.height));
        const oppositeSideOffset = new Vec2(Math.abs(this.config.width), 0);
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    bottomMiddleResize(): void {
        const resizeOriginOffset = new Vec2(Math.abs(this.config.width / 2), Math.abs(this.config.height));
        const oppositeSideOffset = new Vec2(Math.abs(this.config.width / 2), 0);
        this.initResize(resizeOriginOffset, oppositeSideOffset);
        this.lockHorizontal = true;
    }

    bottomRightResize(): void {
        const resizeOriginOffset = new Vec2(Math.abs(this.config.width), Math.abs(this.config.height));
        const oppositeSideOffset = new Vec2(0, 0);
        this.initResize(resizeOriginOffset, oppositeSideOffset);
    }

    private initAttribs(): void {
        this.oppositeSide = new Vec2(0, 0);
        this.resizeOrigin = new Vec2(0, 0);
        this.config.scaleFactor = new Vec2(1, 1);
        this.resizeSelected = false;
        this.memoryCanvas = undefined;
        this.lockVertical = false;
        this.lockHorizontal = false;
    }

    private adaptMousePosition(mousePos: Vec2): Vec2 {
        if (this.config.shift.isDown && !this.lockHorizontal && !this.lockVertical) {
            const distance = mousePos.substract(this.oppositeSide);
            const smallestDistance = Math.min(Math.abs(distance.x), Math.abs(distance.y));
            const returnedX = this.oppositeSide.x + Math.sign(distance.x) * smallestDistance;
            const returnedY = this.oppositeSide.y + Math.sign(distance.y) * smallestDistance;
            return new Vec2(returnedX, returnedY);
        } else {
            return mousePos;
        }
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
                const maxTranslation = this.oppositeSide.x - this.resizeOrigin.x - this.MINIMUM_RESIZE_SIZE;
                finalX = translation.x > maxTranslation ? maxTranslation : translation.x;
            } else if (mousePos.x < this.oppositeSide.x) {
                finalX = mousePos.x - this.oppositeSide.x + this.MINIMUM_RESIZE_SIZE;
            }
        }

        if (!this.lockVertical) {
            if (this.resizeOrigin.y < this.oppositeSide.y) {
                const maxTranslation = this.oppositeSide.y - this.resizeOrigin.y - this.MINIMUM_RESIZE_SIZE;
                finalY = translation.y > maxTranslation ? maxTranslation : translation.y;
            } else if (mousePos.y < this.oppositeSide.y) {
                finalY = mousePos.y - this.oppositeSide.y + this.MINIMUM_RESIZE_SIZE;
            }
        }

        return new Vec2(finalX, finalY);
    }

    private initResize(resizeOriginOffset: Vec2, oppositeSideOffset: Vec2): void {
        if (this.config.selectionCtx === null) return;

        this.resizeOrigin = this.config.endCoords.add(resizeOriginOffset);
        this.oppositeSide = this.config.endCoords.add(oppositeSideOffset);

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
        return new Vec2(translationX, translationY);
    }

    private getNewSize(mousePos: Vec2): Vec2 {
        return new Vec2(
            this.lockHorizontal ? this.config.width : mousePos.x - this.oppositeSide.x,
            this.lockVertical ? this.config.height : mousePos.y - this.oppositeSide.y,
        );
    }
}
