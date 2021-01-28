import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
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
    private lineWidthIn: number = 1;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shortCutKey = 'c';
    }

    get strokeStyle(): string {
        return this.strokeStyleIn;
    }

    /**
     * Types d'entrées acceptées:
     * "couleur";
     * "#FFFFFF";
     * "rgb(int, int, int)";
     * "rgba(int, int, int, 1.0)";
     */
    set strokeStyle(color: string) {
        let colorIsValid = false;
        const style = new Option().style;
        style.color = color;
        colorIsValid = colorIsValid || style.color === color;
        colorIsValid = colorIsValid || /^#([0-9A-F]{3}){1,2}$/.test(color);
        colorIsValid = colorIsValid || /^rgb\((\d+),\s?(\d+),\s?(\d+)\)$/.test(color);
        colorIsValid = colorIsValid || /^rgba\((\d+,\s?){3}(1(\.0+)?|0*(\.\d+))\)$/.test(color);

        if (colorIsValid) {
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
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);
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

        // Cas spécial pour permettre de dessiner exactement un seul pixel (sinon il n'est pas visible)
        if (
            this.lineWidth <= 1 &&
            pathData.length === 1 &&
            pathData[0].length === 2 &&
            pathData[0][0].x === pathData[0][1].x &&
            pathData[0][0].y === pathData[0][1].y
        ) {
            ctx.fillRect(pathData[0][0].x, pathData[0][0].y, 1, 1);
            ctx.stroke();
            return;
        }

        for (const paths of pathData) {
            for (const point of paths) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            ctx.beginPath();
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
        this.pathData.push([]);
    }
}
