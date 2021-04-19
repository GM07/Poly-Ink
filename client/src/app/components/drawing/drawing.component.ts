import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CanvasConst } from '@app/constants/canvas';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/drawing/grid.service';
import { NewDrawingService } from '@app/services/popups/new-drawing';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) private baseCanvas: ElementRef<HTMLCanvasElement>;
    // Using the preview canvas to draw without affecting the final drawing
    @ViewChild('previewCanvas', { static: false }) private previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('grid', { static: false }) private grid: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;

    constructor(
        private drawingService: DrawingService,
        readonly TOOL_HANDLER_SERVICE: ToolHandlerService,
        private newDrawingService: NewDrawingService,
        public gridService: GridService,
    ) {
        this.canvasSize = new Vec2(CanvasConst.DEFAULT_WIDTH, CanvasConst.DEFAULT_HEIGHT);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.grid.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.magnetismService.gridService.ctx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.magnetismService.gridService.canvas = this.grid.nativeElement;
        document.body.style.overflow = 'auto';

        this.newDrawingService.newCanvas();
        this.drawingService.loadDrawing();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.TOOL_HANDLER_SERVICE.onMouseDown(event);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        this.TOOL_HANDLER_SERVICE.onDoubleClick(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.TOOL_HANDLER_SERVICE.onMouseUp(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.TOOL_HANDLER_SERVICE.onKeyUp(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.TOOL_HANDLER_SERVICE.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.TOOL_HANDLER_SERVICE.onMouseEnter(event);
    }
}
