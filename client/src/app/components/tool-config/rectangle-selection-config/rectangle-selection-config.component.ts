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

    private readonly CONTROL_POSITION: number = 8;
    private readonly BORDER: number = 2;
    private readonly CANVAS_COORD: Vec2;

    private controlPointList: Map<ElementRef<HTMLElement>, Vec2>;
    private lastCursor: string;

    isOverSelection: boolean = false;
    mouseDown: boolean = false;
    displayControlPoints = false;

    constructor(public selectionService: RectangleSelectionService, private drawingService: DrawingService) {
        super();
        this.CANVAS_COORD = this.setOriginalPosition(drawingService.canvas.getBoundingClientRect());
    }

    ngAfterViewInit(): void {
        this.lastCursor = this.drawingService.previewCanvas.style.cursor;
    }

    ngOnDestroy(): void {
        this.drawingService.previewCanvas.style.cursor = this.lastCursor;
    }

    initPoints() {
        this.controlPointList = new Map([
            [this.topLeft, this.setOriginalPosition(this.topLeft.nativeElement.getBoundingClientRect())],
            [this.topMiddle, this.setOriginalPosition(this.topMiddle.nativeElement.getBoundingClientRect())],
            [this.topRight, this.setOriginalPosition(this.topRight.nativeElement.getBoundingClientRect())],
            [this.middleLeft, this.setOriginalPosition(this.middleLeft.nativeElement.getBoundingClientRect())],
            [this.middleRight, this.setOriginalPosition(this.middleRight.nativeElement.getBoundingClientRect())],
            [this.bottomLeft, this.setOriginalPosition(this.bottomLeft.nativeElement.getBoundingClientRect())],
            [this.bottomMiddle, this.setOriginalPosition(this.bottomMiddle.nativeElement.getBoundingClientRect())],
            [this.bottomRight, this.setOriginalPosition(this.bottomRight.nativeElement.getBoundingClientRect())],
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

        this.topLeft.nativeElement.style.left = String(this.getCanvasCoord(this.topLeft).x + x - this.CONTROL_POSITION) + 'px';
        this.topLeft.nativeElement.style.top = String(this.getCanvasCoord(this.topLeft).y + y - this.CONTROL_POSITION) + 'px';
        this.topMiddle.nativeElement.style.left = String(this.getCanvasCoord(this.topMiddle).x + x + width / 2) + 'px';
        this.topMiddle.nativeElement.style.top = String(this.getCanvasCoord(this.topMiddle).y + y - this.CONTROL_POSITION) + 'px';
        this.topRight.nativeElement.style.left = String(this.getCanvasCoord(this.topRight).x + x + width + this.BORDER) + 'px';
        this.topRight.nativeElement.style.top = String(this.getCanvasCoord(this.topRight).y + y - this.CONTROL_POSITION) + 'px';

        this.middleLeft.nativeElement.style.left = String(this.getCanvasCoord(this.middleLeft).x + x - this.CONTROL_POSITION) + 'px';
        this.middleLeft.nativeElement.style.top = String(this.getCanvasCoord(this.middleLeft).y + y + height / 2) + 'px';
        this.middleRight.nativeElement.style.left = String(this.getCanvasCoord(this.middleRight).x + x + width + this.BORDER) + 'px';
        this.middleRight.nativeElement.style.top = String(this.getCanvasCoord(this.middleRight).y + y + height / 2) + 'px';

        this.bottomLeft.nativeElement.style.left = String(this.getCanvasCoord(this.bottomLeft).x + x - this.CONTROL_POSITION) + 'px';
        this.bottomLeft.nativeElement.style.top = String(this.getCanvasCoord(this.bottomLeft).y + y + height + this.BORDER) + 'px';
        this.bottomMiddle.nativeElement.style.left = String(this.getCanvasCoord(this.bottomMiddle).x + x + width / 2) + 'px';
        this.bottomMiddle.nativeElement.style.top = String(this.getCanvasCoord(this.bottomMiddle).y + y + height + this.BORDER) + 'px';
        this.bottomRight.nativeElement.style.left = String(this.getCanvasCoord(this.bottomRight).x + x + width + this.BORDER) + 'px';
        this.bottomRight.nativeElement.style.top = String(this.getCanvasCoord(this.bottomRight).y + y + height + this.BORDER) + 'px';

        for (const [elementRef, domRect] of this.controlPointList) {
            const pos = elementRef.nativeElement.getBoundingClientRect();
            if (this.isInCanvas({ x: pos.x, y: pos.y } as Vec2)) {
                elementRef.nativeElement.style.opacity = '1';
                elementRef.nativeElement.style.pointerEvents = 'auto';
            } else {
                elementRef.nativeElement.style.opacity = '0';
                elementRef.nativeElement.style.pointerEvents = 'none';
            }
        }
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
                this.drawingService.previewCanvas.style.cursor = 'all-scroll';
            } else {
                this.drawingService.previewCanvas.style.cursor = this.lastCursor;
            }
        } else {
            if (this.displayControlPoints) {
                this.placePoints();
            }
        }
    }

    private isInCanvas(position: Vec2): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        if (position.x <= left || position.x >= right || position.y <= top || position.y >= bottom) return false;
        return true;
    }

    private getCanvasCoord(control: ElementRef<HTMLElement>): Vec2 {
        const pos = this.controlPointList.get(control);
        if (pos === undefined) return { x: 0, y: 0 } as Vec2;
        const left = this.CANVAS_COORD.x - pos.x;
        const top = this.CANVAS_COORD.y - pos.y;
        return { x: left, y: top } as Vec2;
    }

    // Il faut prendre en compte l'état de fenêtre window.scroll,
    // sinon lorsqu'il y a une barre de défilement, la position des points devient erronée
    private setOriginalPosition(domRect: DOMRect): Vec2 {
        return { x: domRect.x + window.scrollX, y: domRect.y + window.scrollY } as Vec2;
    }
}
