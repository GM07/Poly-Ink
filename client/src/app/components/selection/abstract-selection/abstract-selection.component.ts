import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { Subscription } from 'rxjs';

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
    @ViewChild('selectionBackground', { static: false }) selectionBackground: ElementRef<HTMLElement>;

    private readonly CONTROL_INNER: number = 8;
    private readonly BORDER: number = 2;
    private readonly MIDDLE_OFFSET: number = (this.CONTROL_INNER - this.BORDER) / 2;
    private readonly DESIRED_ZINDEX: number = 3;

    private controlPointList: ElementRef<HTMLElement>[];
    private lastCanvasCursor: string;
    private lastDocumentCursor: string;

    private resizeSelected: boolean;
    private isOverSelection: boolean;
    private isInSidebar: boolean;
    private leftMouseDown: boolean;
    displayControlPoints: boolean;
    private updateSubscription: Subscription;
    private shortcutSubscription: Subscription;

    constructor(
        protected selectionService: AbstractSelectionService,
        protected drawingService: DrawingService,
        private cd: ChangeDetectorRef,
        private selectionEvents: SelectionEventsService,
        private shortcutHandlerService: ShortcutHandlerService,
    ) {}

    ngOnInit(): void {
        this.updateSubscription = this.selectionService.updatePoints.subscribe((display: boolean) => {
            if (display && this.displayControlPoints) {
                this.placePoints();
            }
            this.updateControlPointDisplay(display);
        });

        this.selectionEvents.onMouseEnterEvent.subscribe(() => (this.isInSidebar = true));
        this.selectionEvents.onMouseLeaveEvent.subscribe(() => (this.isInSidebar = false));
        this.isOverSelection = false;
        this.isInSidebar = false;
        this.leftMouseDown = false;
        this.displayControlPoints = false;
        this.resizeSelected = false;
    }

    ngAfterViewInit(): void {
        this.lastDocumentCursor = document.body.style.cursor;
        this.lastCanvasCursor = this.drawingService.previewCanvas.style.cursor;

        this.shortcutSubscription = this.shortcutHandlerService.blockShortcutsEvent.subscribe((block: boolean) => {
            if (block) this.resetCursor();
        });
    }

    ngOnDestroy(): void {
        this.resetCursor();
        this.updateSubscription.unsubscribe();
        this.shortcutSubscription.unsubscribe();
    }

    onMouseDown(event: MouseEvent): void {
        if (this.shortcutHandlerService.blockShortcuts || this.resizeSelected) return;

        console.log('in');

        this.leftMouseDown = event.button === MouseButton.Left;
        if (!this.isInSidebar && this.leftMouseDown) {
            if (this.selectionService.isInSelection(event)) {
                this.selectionService.onMouseDown(event);
                this.makeControlsUnselectable();
                this.selectionService.translationOrigin = this.selectionService.getPositionFromMouse(event);
            } else if (this.selectionService.selectionCtx !== null) {
                this.selectionService.onMouseDown(event);
            }
        }
        this.updateControlPointDisplay(this.selectionService.selectionCtx !== null);
    }

    onMouseUp(): void {
        if (this.shortcutHandlerService.blockShortcuts) return;

        if (this.displayControlPoints) {
            this.makeControlsSelectable();
        }
        this.updateControlPointDisplay(this.selectionService.selectionCtx !== null);
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.shortcutHandlerService.blockShortcuts) return;

        if (!this.leftMouseDown) {
            this.isOverSelection = this.selectionService.isInSelection(event);
            if (this.isOverSelection && !this.isInSidebar) {
                this.drawingService.previewCanvas.style.cursor = 'all-scroll';
                document.body.style.cursor = 'all-scroll';
            } else {
                this.resetCursor();
            }
        }
    }

    private startResize(): void {
        this.resizeSelected = true;
    }

    private endResize(): void {
        this.resizeSelected = false;
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
        ];

        this.placePoints();

        this.controlPointContainer.nativeElement.style.zIndex = this.DESIRED_ZINDEX.toString();
        this.resizeSelected = false;
        for (const element of this.controlPointList) {
            element.nativeElement.onmousedown = () => this.startResize();
            element.nativeElement.onmouseup = () => this.endResize();
        }
    }

    private placePoints(): void {
        if (this.selectionService.selectionCtx === null) return;

        const width = Math.abs(this.selectionService.config.width);
        const height = Math.abs(this.selectionService.config.height);

        this.placeControlPoint(this.topLeft, 0 - this.CONTROL_INNER, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.topMiddle, width / 2 - this.MIDDLE_OFFSET, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.topRight, width + this.BORDER, 0 - this.CONTROL_INNER);
        this.placeControlPoint(this.middleLeft, 0 - this.CONTROL_INNER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.middleRight, width + this.BORDER, height / 2 - this.MIDDLE_OFFSET);
        this.placeControlPoint(this.bottomLeft, 0 - this.CONTROL_INNER, height + this.BORDER);
        this.placeControlPoint(this.bottomMiddle, width / 2 - this.MIDDLE_OFFSET, height + this.BORDER);
        this.placeControlPoint(this.bottomRight, width + this.BORDER, height + this.BORDER);
        this.placeSelectionBorder(width + this.BORDER, height + this.BORDER);
    }

    private placeControlPoint(element: ElementRef<HTMLElement>, offsetX: number, offsetY: number): void {
        const x = this.selectionService.config.endCoords.x;
        const y = this.selectionService.config.endCoords.y;
        element.nativeElement.style.left = String(x + offsetX) + 'px';
        element.nativeElement.style.top = String(y + offsetY) + 'px';
    }

    private placeSelectionBorder(sizeX: number, sizeY: number): void {
        const x = this.selectionService.config.endCoords.x;
        const y = this.selectionService.config.endCoords.y;
        this.border.nativeElement.style.left = String(x) + 'px';
        this.border.nativeElement.style.top = String(y) + 'px';
        this.border.nativeElement.style.width = sizeX + 'px';
        this.border.nativeElement.style.height = sizeY + 'px';

        this.selectionBackground.nativeElement.style.left = String(x) + 'px';
        this.selectionBackground.nativeElement.style.top = String(y) + 'px';
        this.selectionBackground.nativeElement.style.width = sizeX + this.BORDER + 'px';
        this.selectionBackground.nativeElement.style.height = sizeY + this.BORDER + 'px';
    }

    private makeControlsUnselectable(): void {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'none';
        }
        this.border.nativeElement.style.pointerEvents = 'none';
    }

    private makeControlsSelectable(): void {
        for (const elementRef of this.controlPointList) {
            elementRef.nativeElement.style.pointerEvents = 'auto';
        }
        this.border.nativeElement.style.pointerEvents = 'auto';
    }

    private resetCursor(): void {
        this.drawingService.previewCanvas.style.cursor = this.lastCanvasCursor;
        document.body.style.cursor = this.lastDocumentCursor;
    }
}
