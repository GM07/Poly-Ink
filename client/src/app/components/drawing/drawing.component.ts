import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolHandlerService } from '@app/services/tools/toolHandler-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    //private tools: Tool[];
    //currentTool: Tool;
    constructor(private drawingService: DrawingService, private toolHandlerServcice: ToolHandlerService) {
        //this.currentTool = this.toolHandlerServcice.findTool(PencilService.name);
        toolHandlerServcice.setTool(PencilService);
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolHandlerServcice.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolHandlerServcice.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolHandlerServcice.onMouseUp(event);
    }

    @HostListener('document:keypress', ['$event'])
    onKeyPress(event: KeyboardEvent) {
        this.toolHandlerServcice.onKeyPress(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
