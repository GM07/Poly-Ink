import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Component({
    selector: 'app-abstract-selection',
    templateUrl: './abstract-selection.component.html',
    styleUrls: ['./abstract-selection.component.scss'],
})
export class AbstractSelectionComponent implements OnDestroy, AfterViewInit, OnInit {
    @ViewChild('controlPointContainer', { static: false }) controlPointContainer: ElementRef<HTMLElement>;
    @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLElement>;
    @ViewChild('topMiddle', { static: false }) topMiddle: ElementRef<HTMLElement>;
    @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLElement>;
    @ViewChild('middleLeft', { static: false }) middleLeft: ElementRef<HTMLElement>;
    @ViewChild('middleRight', { static: false }) middleRight: ElementRef<HTMLElement>;
    @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLElement>;
    @ViewChild('bottomMiddle', { static: false }) bottomMiddle: ElementRef<HTMLElement>;
    @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLElement>;
    @ViewChild('border', { static: false }) border: ElementRef<HTMLElement>;

    private readonly CONTROL_INNER: number = 8;
    private readonly BORDER: number = 2;
    private readonly MIDDLE_OFFSET: number = (this.CONTROL_INNER - this.BORDER) / 2;
    private readonly DESIRED_ZINDEX: number = 3;

    private controlPointList: ElementRef<HTMLElement>[];
    private lastCanvasCursor: string;
    private lastDocumentCursor: string;

    private isOverSelection: boolean = false;
    private isInDrawing: boolean = true;
    private leftMouseDown: boolean = false;
    displayControlPoints: boolean = false;

    constructor(
        protected selectionService: AbstractSelectionService,
        protected drawingService: DrawingService,
        private cd: ChangeDetectorRef,
        private selectionEvents: SelectionEventsService,
    ) {}

    ngOnInit(): void {
        this.selectionService.updatePoints.subscribe((display: boolean) => {
            if (display && this.displayControlPoints) {
                this.placePoints();
            }
            this.updateControlPointDisplay(display);
        });

        this.selectionEvents.onMouseEnterEvent.subscribe(() => (this.isInDrawing = true));
        this.selectionEvents.onMouseLeaveEvent.subscribe(() => (this.isInDrawing = false));
    }

    ngAfterViewInit(): void {
        this.lastDocumentCursor = document.body.style.cursor;
        this.lastCanvasCursor = this.drawingService.previewCanvas.style.cursor;
    }

    ngOnDestroy(): void {
        document.body.style.cursor = this.lastDocumentCursor;
        this.drawingService.previewCanvas.style.cursor = this.lastCanvasCursor;
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.isInDrawing) {
            if (this.leftMouseDown && this.selectionService.isInSelection(event)) {
                this.selectionService.onMouseDown(event);
                this.makeControlsUnselectable();
                this.selectionService.translationOrigin = this.selectionService.getPositionFromMouse(event);
            }
        } else if (this.selectionService.selectionCtx !== null) {
            this.selectionService.stopDrawing();
        }
        this.updateControlPointDisplay(this.selectionService.selectionCtx !== null);
    }

    onMouseUp(): void {
        if (this.displayControlPoints) {
            this.makeControlsSelectable();
        }
        this.leftMouseDown = false;
        this.updateControlPointDisplay(this.selectionService.selectionCtx !== null);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.leftMouseDown) {
            this.isOverSelection = this.selectionService.isInSelection(event);
            if (this.isOverSelection && this.isInDrawing) {
                this.drawingService.previewCanvas.style.cursor = 'all-scroll';
                document.body.style.cursor = 'all-scroll';
            } else {
                this.drawingService.previewCanvas.style.cursor = this.lastCanvasCursor;
                document.body.style.cursor = this.lastDocumentCursor;
            }
        }
    }

    private updateControlPointDisplay(display: boolean): void {
        const lastDisplayControlPoints = this.displayControlPoints;
        this.displayControlPoints = display;
        if (!lastDisplayControlPoints && display) {
            this.cd.detectChanges();
            this.initPoints();
        }
    }

    private initPoints(): void {
        this.controlPointList = [
            this.topLeft,
            this.topMiddle,
            this.topRight,
            this.middleLeft,
            this.middleRight,
            this.bottomLeft,
            this.bottomMiddle,
            this.bottomRight,
            this.border,
        ];

        this.placePoints();

        this.controlPointContainer.nativeElement.style.zIndex = this.DESIRED_ZINDEX.toString();
    }

    private placePoints(): void {
        if (this.selectionService.selectionCtx === null) return;

        const width = Math.abs(this.selectionService.width);
        const height = Math.abs(this.selectionService.height);

        this.placeControlPoint(this.topLeft, 0 - this.CONTROL_INNER, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.topMiddle, width / 2 - this.MIDDLE_OFFSET, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.topRight, width + this.BORDER, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.middleLeft, 0 - this.CONTROL_INNER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.middleRight, width + this.BORDER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.bottomLeft, 0 - this.CONTROL_INNER, height + this.BORDER);
        this.placeControlPoint(this.bottomMiddle, width / 2 - this.MIDDLE_OFFSET, height + this.BORDER);
        this.placeControlPoint(this.bottomRight, width + this.BORDER, height + this.BORDER);
        this.placeBorder(this.border, width + this.BORDER, height + this.BORDER);
    }

    private placeControlPoint(element: ElementRef<HTMLElement>, offsetX: number, offsetY: number): void {
        const x = this.selectionService.selectionCoords.x;
        const y = this.selectionService.selectionCoords.y;
        element.nativeElement.style.left = String(x + offsetX) + 'px';
        element.nativeElement.style.top = String(y + offsetY) + 'px';
    }

    private placeBorder(element: ElementRef<HTMLElement>, sizeX: number, sizeY: number): void {
        const x = this.selectionService.selectionCoords.x;
        const y = this.selectionService.selectionCoords.y;
        element.nativeElement.style.left = String(x) + 'px';
        element.nativeElement.style.top = String(y) + 'px';
        element.nativeElement.style.width = sizeX + 'px';
        element.nativeElement.style.height = sizeY + 'px';
    }

    private makeControlsUnselectable(): void {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'none';
        }
    }

    private makeControlsSelectable(): void {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'auto';
        }
    }
}
