import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
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
    private pathData: Vec2[];
    private strokeStyle_: string = '#000000';
    private lineWidth_: number = 5;

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
            this.drawLine(this.drawingService.baseCtx, this.pathData); //Évite de perdre le trait si la souris sort
            this.clearPath();
        }

        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.beginPath();

        if (this.lineWidth <= 1 && path.length == 2 && path[0].x == path[1].x && path[0].y == path[1].y) {
            //Cas spécial pour permettre de dessiner un seul pixel
            ctx.fillRect(path[0].x, path[0].y, 1, 1);
        } else {
            for (const point of path) {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
