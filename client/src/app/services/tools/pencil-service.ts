import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

/**
 * Note: Pas besoin d'implémtenter le code pour commencer à dessiner un ligne quand le bouton de la souris
 * est enfoncé hors du canvas (Ref: Document de vision Polydessin 2 v1.0, p.10)
 */
// Ceci est une implémentation de l'outil Crayon
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[][];
    private strokeStyleIn: string = 'black';
    private lineWidthIn: number = 12;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shortCutKey = 'c';
    }

    get strokeStyle(): string {
        return this.strokeStyleIn;
    }

    set strokeStyle(color: string) {
        if (Tool.isColorValid(color)) {
            this.strokeStyleIn = color;
        }
    }

    get lineWidth(): number {
        return this.lineWidthIn;
    }

    /**
     * La taille se choisit par pixel, donc un arrondissement
     * est fait pour avoir une valeur entière
     */
    set lineWidth(width: number) {
        this.lineWidthIn = Math.max(Math.round(width), 1);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                const mousePosition = this.getPositionFromMouse(event);
                this.pathData[this.pathData.length - 1].push(mousePosition);
            }
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawBackgroundPoint(this.getPositionFromMouse(event));

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (!this.mouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed) {
            this.pathData.push([]);
            this.onMouseMove(event);
        } else if (event.buttons === LeftMouse.Released) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.mouseDown = false;
            this.clearPath();
        }
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private drawBackgroundPoint(point: Vec2): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawLine(ctx, [[point]]);
    }

    private drawLine(ctx: CanvasRenderingContext2D, pathData: Vec2[][]): void {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin; // Essentiel pour avoir une allure "smooth"

        for (const paths of pathData) {
            // Cas spécial pour permettre de dessiner exactement un seul pixel (sinon il n'est pas visible)
            if (paths.length === 1 || (paths.length === 2 && paths[0].x === paths[1].x && paths[0].y === paths[1].y)) {
                ctx.arc(paths[0].x, paths[0].y, 1 / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
            } else {
                for (const point of paths) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
                ctx.beginPath();
            }
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
        this.pathData.push([]);
    }
}
