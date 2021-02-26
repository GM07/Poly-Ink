import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection-config',
    templateUrl: './rectangle-selection-config.component.html',
    styleUrls: ['./rectangle-selection-config.component.scss'],
})
export class RectangleSelectionConfigComponent extends ToolConfig implements OnDestroy, AfterViewInit {
    @ViewChild('controlPointContainer', { static: false }) controlPointContainer: ElementRef<HTMLElement>;
    @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLElement>;
    @ViewChild('topMiddle', { static: false }) topMiddle: ElementRef<HTMLElement>;
    @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLElement>;
    @ViewChild('middleLeft', { static: false }) middleLeft: ElementRef<HTMLElement>;
    @ViewChild('middleRight', { static: false }) middleRight: ElementRef<HTMLElement>;
    @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLElement>;
    @ViewChild('bottomMiddle', { static: false }) bottomMiddle: ElementRef<HTMLElement>;
    @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLElement>;

    private readonly CANVAS_COORD: DOMRect;
    private readonly PREVIEW_CANVAS: HTMLCanvasElement;
    private controlPointList: Map<ElementRef<HTMLElement>, DOMRect>;
    private lastCursor: string;

    isOverSelection: boolean = false;
    mouseDown: boolean = false;
    displayControlPoints = false;

    constructor(public selectionService: RectangleSelectionService, drawingService: DrawingService) {
        super();
        this.PREVIEW_CANVAS = drawingService.previewCanvas;
        this.CANVAS_COORD = drawingService.canvas.getBoundingClientRect();
    }

    ngAfterViewInit(): void {
        this.lastCursor = this.PREVIEW_CANVAS.style.cursor;
    }

    ngOnDestroy(): void {
        this.PREVIEW_CANVAS.style.cursor = this.lastCursor;
    }

    initPoints() {
        this.controlPointList = new Map([
            [this.topLeft, this.topLeft.nativeElement.getBoundingClientRect()],
            [this.topMiddle, this.topMiddle.nativeElement.getBoundingClientRect()],
            [this.topRight, this.topRight.nativeElement.getBoundingClientRect()],
            [this.middleLeft, this.middleLeft.nativeElement.getBoundingClientRect()],
            [this.middleRight, this.middleRight.nativeElement.getBoundingClientRect()],
            [this.bottomLeft, this.bottomLeft.nativeElement.getBoundingClientRect()],
            [this.bottomMiddle, this.bottomMiddle.nativeElement.getBoundingClientRect()],
            [this.bottomRight, this.bottomRight.nativeElement.getBoundingClientRect()],
        ]);

        this.placePoints();

        this.controlPointContainer.nativeElement.style.zIndex = '1';
    }

    private placePoints() {
        if (this.selectionService.selectionCtx === null) return;

        const x = this.selectionService.selectionCoords.x;
        const y = this.selectionService.selectionCoords.y;
        const width = Math.abs(this.selectionService.width);
        const height = Math.abs(this.selectionService.height);

        this.topLeft.nativeElement.style.left = String(this.getCanvasCoord(this.topLeft).x + x) + 'px';
        this.topLeft.nativeElement.style.top = String(this.getCanvasCoord(this.topLeft).y + y) + 'px';
        this.topMiddle.nativeElement.style.left = String(this.getCanvasCoord(this.topMiddle).x + x + width / 2) + 'px';
        this.topMiddle.nativeElement.style.top = String(this.getCanvasCoord(this.topMiddle).y + y) + 'px';
        this.topRight.nativeElement.style.left = String(this.getCanvasCoord(this.topRight).x + x + width) + 'px';
        this.topRight.nativeElement.style.top = String(this.getCanvasCoord(this.topRight).y + y) + 'px';

        this.middleLeft.nativeElement.style.left = String(this.getCanvasCoord(this.middleLeft).x + x) + 'px';
        this.middleLeft.nativeElement.style.top = String(this.getCanvasCoord(this.middleLeft).y + y + height / 2) + 'px';
        this.middleRight.nativeElement.style.left = String(this.getCanvasCoord(this.middleRight).x + x + width) + 'px';
        this.middleRight.nativeElement.style.top = String(this.getCanvasCoord(this.middleRight).y + y + height / 2) + 'px';

        this.bottomLeft.nativeElement.style.left = String(this.getCanvasCoord(this.bottomLeft).x + x) + 'px';
        this.bottomLeft.nativeElement.style.top = String(this.getCanvasCoord(this.bottomLeft).y + y + height) + 'px';
        this.bottomMiddle.nativeElement.style.left = String(this.getCanvasCoord(this.bottomMiddle).x + x + width / 2) + 'px';
        this.bottomMiddle.nativeElement.style.top = String(this.getCanvasCoord(this.bottomMiddle).y + y + height) + 'px';
        this.bottomRight.nativeElement.style.left = String(this.getCanvasCoord(this.bottomRight).x + x + width) + 'px';
        this.bottomRight.nativeElement.style.top = String(this.getCanvasCoord(this.bottomRight).y + y + height) + 'px';
    }

    onMouseDown(event: MouseEvent) {
        this.mouseDown = event.button === MouseButton.Left;
        this.displayControlPoints = this.selectionService.selectionCtx !== null;
    }

    onMouseUp(event: MouseEvent) {
        if (this.displayControlPoints) {
            this.placePoints();
        }
        this.mouseDown = false;
        this.displayControlPoints = this.selectionService.selectionCtx !== null;
    }

    onMouseMove(event: MouseEvent) {
        if (!this.mouseDown) {
            this.isOverSelection = this.selectionService.isInSelection(event);
            if (this.isOverSelection) {
                this.PREVIEW_CANVAS.style.cursor = 'all-scroll';
            } else {
                this.PREVIEW_CANVAS.style.cursor = this.lastCursor;
            }
        } else {
            if (this.displayControlPoints) {
                this.placePoints();
            }
        }
    }

    private getCanvasCoord(control: ElementRef<HTMLElement>): Vec2 {
        const pos = this.controlPointList.get(control);
        if (pos === undefined) return { x: 0, y: 0 } as Vec2;
        const left = this.CANVAS_COORD.x - pos.x;
        const top = this.CANVAS_COORD.y - pos.y;
        return { x: left, y: top } as Vec2;
    }
}
