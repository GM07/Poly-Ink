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

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[][];
    private strokeStyle_: string = '#000000';
    private lineWidth_: number = 10;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shortCutKey = 'c';
    }

    get strokeStyle(): string {
        return this.strokeStyle_;
    }

    /**
     * Types d'entrées acceptées:
     * "couleur";
     * "#FFFFFF";
     * "rgb(255, 255, 255)";
     * "rgba(255, 255, 255, 1)";
     */
    set strokeStyle(strokeStyleIn: string) {
        this.strokeStyle_ = strokeStyleIn;
    }

    get lineWidth(): number {
        return this.lineWidth_;
    }

    /**
     * La taille se choisit par pixel, donc un arrondissement
     * est fait pour avoir une valeur entière
     */
    set lineWidth(lineWidthIn: number) {
        this.lineWidth_ = Math.max(Math.round(lineWidthIn), 1);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.mouseDown && event.button === MouseButton.Left) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);
            return;
        }

        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        console.log(this.pathData);
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawPoint(this.getPositionFromMouse(event));

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
        if (event.button != MouseButton.Left) return;

        if (event.buttons == LeftMouse.Pressed) {
            this.pathData.push([]);
            this.onMouseDown(event);
        } else if (event.buttons == LeftMouse.Released) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.mouseDown = false;
            this.clearPath();
        }
    }

    private drawPoint(point: Vec2) {
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
        ctx.lineJoin = 'round' as CanvasLineJoin; //Essentiel pour avoir une allure "smooth"

        //Cas spécial pour permettre de dessiner exactement un seul pixel (sinon il n'est pas visible)
        if (
            this.lineWidth <= 1 &&
            pathData.length == 1 &&
            pathData[0].length == 2 &&
            pathData[0][0].x == pathData[0][1].x &&
            pathData[0][0].y == pathData[0][1].y
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
        //ctx.closePath();
    }

    private clearPath(): void {
        this.pathData = [];
        this.pathData.push([]);
    }
}
