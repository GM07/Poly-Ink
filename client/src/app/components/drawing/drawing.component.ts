import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
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
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // Using this canvas to draw without affecting the final drawing
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('grid', { static: false }) grid: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;

    gridVisibility: boolean;

    constructor(
        private drawingService: DrawingService,
        readonly toolHandlerService: ToolHandlerService,
        private newDrawingService: NewDrawingService,
        private gridService: GridService,
    ) {
        this.canvasSize = { x: CanvasConst.DEFAULT_WIDTH, y: CanvasConst.DEFAULT_HEIGHT } as Vec2;
        this.gridVisibility = true;
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.grid.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridService.ctx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.gridService.canvas = this.grid.nativeElement;
        document.body.style.overflow = 'auto';

        this.newDrawingService.newCanvas();
        this.drawingService.loadDrawing();

        this.gridVisibility = false;
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolHandlerService.onMouseDown(event);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        this.toolHandlerService.onDoubleClick(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolHandlerService.onMouseUp(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolHandlerService.onKeyUp(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.toolHandlerService.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.toolHandlerService.onMouseEnter(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.gridService.toggleGridShortcut.equals(event)) {
            this.gridVisibility = !this.gridVisibility;
            this.grid.nativeElement.style.visibility = this.gridVisibility ? 'visible' : 'hidden';
        } else if (ShortcutKey.contains(this.gridService.upsizeGridShortcut, event)) {
            this.gridService.upsizeGrid();
            this.drawingService.clearCanvas(this.drawingService.gridService.ctx);
            this.gridService.updateGrid();
        } else if (this.gridService.downSizeGridShortcut.equals(event)) {
            this.gridService.downsizeGrid();
            this.drawingService.clearCanvas(this.drawingService.gridService.ctx);
            this.gridService.updateGrid();
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
