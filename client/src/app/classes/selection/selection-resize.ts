import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

export class SelectionResize {
    resizeSelected: boolean;

    readonly UPDATE_SELECTION_REQUEST: Subject<Vec2> = new Subject<Vec2>();
    private readonly FLIP_IMAGE_FACTOR: number = -1;
    private readonly MINIMUM_RESIZE_SIZE: number = 1;

    private config: SelectionConfig;
    private oppositeSide: Vec2;
    private resizeOrigin: Vec2;
    private memoryCanvas: HTMLCanvasElement | undefined;
    private lockVertical: boolean;
    private lockHorizontal: boolean;

    constructor(config: SelectionConfig) {
        this.config = config;
        this.initAttribs();
    }

    stopDrawing(): void {
        this.config.scaleFactor = new Vec2(1, 1);
        this.initAttribs();
    }

    resize(mousePosIn: Vec2): void {
        if (this.config.previewSelectionCtx === null || this.memoryCanvas == undefined) return;

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
        const canvas = this.config.SELECTION_DATA;
        canvas.width = Math.abs(newSize.x);
        canvas.height = Math.abs(newSize.y);
        this.config.previewSelectionCtx.drawImage(this.memoryCanvas, 0, 0, Math.abs(newSize.x), Math.abs(newSize.y));
        this.UPDATE_SELECTION_REQUEST.next(this.getTranslationForResize(mousePos));

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
        this.resizeSelected = false;
        this.memoryCanvas = undefined;
        this.lockVertical = false;
        this.lockHorizontal = false;
    }

    private adaptMousePosition(mousePos: Vec2): Vec2 {
        if (this.config.shift.isDown && !this.lockHorizontal && !this.lockVertical) {
            const distance = mousePos.substract(this.oppositeSide);
            const smallestDistance = Math.min(Math.abs(distance.x), Math.abs(distance.y));
            return this.oppositeSide.add(distance.apply(Math.sign).scalar(smallestDistance));
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
        if (this.config.previewSelectionCtx === null || this.memoryCanvas === undefined) return;

        this.config.scaleFactor.x *= this.FLIP_IMAGE_FACTOR;
        this.flipDrawing(this.memoryCanvas, new Vec2(-this.memoryCanvas.width, 0), new Vec2(this.FLIP_IMAGE_FACTOR, 1));
        this.flipDrawing(this.config.SELECTION_DATA, new Vec2(-this.config.SELECTION_DATA.width, 0), new Vec2(this.FLIP_IMAGE_FACTOR, 1));
    }

    private flipVertical(): void {
        if (this.config.previewSelectionCtx === null || this.memoryCanvas === undefined) return;

        this.config.scaleFactor.y *= this.FLIP_IMAGE_FACTOR;
        this.flipDrawing(this.memoryCanvas, new Vec2(0, -this.memoryCanvas.height), new Vec2(1, this.FLIP_IMAGE_FACTOR));
        this.flipDrawing(this.config.SELECTION_DATA, new Vec2(0, -this.config.SELECTION_DATA.height), new Vec2(1, this.FLIP_IMAGE_FACTOR));
    }

    private flipDrawing(canvas: HTMLCanvasElement, offset: Vec2, scaleFactor: Vec2): void {
        const tempCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(tempCanvas, canvas);

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(scaleFactor.x, scaleFactor.y);
        ctx.drawImage(tempCanvas, offset.x, offset.y);
        ctx.restore();
    }

    private getTranslationForResize(mousePos: Vec2): Vec2 {
        const translation = this.getTranslation(mousePos);
        let finalX = 0;
        let finalY = 0;
        if (!this.lockHorizontal) {
            if (this.resizeOrigin.x < this.oppositeSide.x) {
                const maxTranslation = this.oppositeSide.x - this.resizeOrigin.x - this.MINIMUM_RESIZE_SIZE;
                finalX = Math.min(translation.x, maxTranslation);
            } else if (mousePos.x < this.oppositeSide.x) {
                finalX = mousePos.x - this.oppositeSide.x + this.MINIMUM_RESIZE_SIZE;
            }
        }

        if (!this.lockVertical) {
            if (this.resizeOrigin.y < this.oppositeSide.y) {
                const maxTranslation = this.oppositeSide.y - this.resizeOrigin.y - this.MINIMUM_RESIZE_SIZE;
                finalY = Math.min(translation.y, maxTranslation);
            } else if (mousePos.y < this.oppositeSide.y) {
                finalY = mousePos.y - this.oppositeSide.y + this.MINIMUM_RESIZE_SIZE;
            }
        }

        return new Vec2(finalX, finalY);
    }

    private initResize(resizeOriginOffset: Vec2, oppositeSideOffset: Vec2): void {
        if (this.config.previewSelectionCtx === null) return;

        this.resizeOrigin = this.config.endCoords.add(resizeOriginOffset);
        this.oppositeSide = this.config.endCoords.add(oppositeSideOffset);

        this.resizeSelected = true;
        this.lockHorizontal = false;
        this.lockVertical = false;
        if (this.memoryCanvas === undefined) {
            this.memoryCanvas = document.createElement('canvas');
            DrawingService.saveCanvas(this.memoryCanvas, this.config.SELECTION_DATA);
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
