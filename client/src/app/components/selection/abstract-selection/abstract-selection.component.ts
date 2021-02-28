import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Component({
    selector: 'app-abstract-selection',
    templateUrl: './abstract-selection.component.html',
    styleUrls: ['./abstract-selection.component.scss'],
})
export class AbstractSelectionComponent implements OnDestroy, AfterViewInit {
    @ViewChild('controlPointContainer', { static: false }) controlPointContainer: ElementRef<HTMLElement>;
    @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLElement>;
    @ViewChild('topMiddle', { static: false }) topMiddle: ElementRef<HTMLElement>;
    @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLElement>;
    @ViewChild('middleLeft', { static: false }) middleLeft: ElementRef<HTMLElement>;
    @ViewChild('middleRight', { static: false }) middleRight: ElementRef<HTMLElement>;
    @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLElement>;
    @ViewChild('bottomMiddle', { static: false }) bottomMiddle: ElementRef<HTMLElement>;
    @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLElement>;

    private readonly CONTROL_INNER: number;
    private readonly BORDER: number;
    private readonly MIDDLE_OFFSET: number;
    private readonly DESIRED_ZINDEX: number;

    private controlPointList: ElementRef<HTMLElement>[];
    private lastCursor: string;

    isOverSelection: boolean = false;
    mouseDown: boolean = false;
    displayControlPoints = false;

    constructor(protected selectionService: AbstractSelectionService, protected drawingService: DrawingService) {
        this.CONTROL_INNER = 8;
        this.BORDER = 2;
        this.MIDDLE_OFFSET = (this.CONTROL_INNER - this.BORDER) / 2;
        this.DESIRED_ZINDEX = 3;
    }

    ngAfterViewInit(): void {
        this.lastCursor = this.drawingService.canvas.style.cursor;
    }

    ngOnDestroy(): void {
        if (this.drawingService.canvas !== undefined) this.drawingService.canvas.style.cursor = this.lastCursor;
    }

    onMouseDown(event: MouseEvent) {
        if (this.selectionService.isInSelection(event)) {
            this.makeControlsUnselectable();
        }
        this.mouseDown = event.button === MouseButton.Left;
        this.displayControlPoints = this.selectionService.selectionCtx !== null;
    }

    onMouseUp() {
        if (this.displayControlPoints) {
            this.makeControlsSelectable();
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
                this.makeControlsUnselectable();
            }
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.displayControlPoints) {
            this.placePoints();
        }
        this.displayControlPoints = this.selectionService.selectionCtx !== null;
    }

    initPoints() {
        this.controlPointList = [
            this.topLeft,
            this.topMiddle,
            this.topRight,
            this.middleLeft,
            this.middleRight,
            this.bottomLeft,
            this.bottomMiddle,
            this.bottomRight,
        ];

        this.placePoints();

        this.controlPointContainer.nativeElement.style.zIndex = this.DESIRED_ZINDEX.toString();
    }

    private placePoints() {
        if (this.selectionService.selectionCtx === null) return;

        const width = Math.abs(this.selectionService.width);
        const height = Math.abs(this.selectionService.height);

        this.placeControlPoint(this.topLeft, -1 * this.CONTROL_INNER, -1 * this.CONTROL_INNER);
        this.placeControlPoint(this.topMiddle, width / 2 - this.MIDDLE_OFFSET, -1 * this.CONTROL_INNER);
        this.placeControlPoint(this.topRight, width + this.BORDER, -1 * this.CONTROL_INNER);
        this.placeControlPoint(this.middleLeft, -1 * this.CONTROL_INNER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.middleRight, width + this.BORDER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.bottomLeft, -1 * this.CONTROL_INNER, height + this.BORDER);
        this.placeControlPoint(this.bottomMiddle, width / 2 - this.MIDDLE_OFFSET, height + this.BORDER);
        this.placeControlPoint(this.bottomRight, width + this.BORDER, height + this.BORDER);

        for (const elementRef of this.controlPointList) {
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

    private placeControlPoint(element: ElementRef<HTMLElement>, offsetX: number, offsetY: number) {
        const x = this.selectionService.selectionCoords.x;
        const y = this.selectionService.selectionCoords.y;
        element.nativeElement.style.left = String(x + offsetX) + 'px';
        element.nativeElement.style.top = String(y + offsetY) + 'px';
    }

    private isInCanvas(position: Vec2): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        const posX = position.x + (this.CONTROL_INNER + this.BORDER) / 2;
        const posY = position.y + (this.CONTROL_INNER + this.BORDER) / 2;

        if (posX <= left || posX >= right || posY <= top || posY >= bottom) return false;
        return true;
    }

    private makeControlsUnselectable() {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'none';
        }
    }

    private makeControlsSelectable() {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'auto';
        }
    }
}
