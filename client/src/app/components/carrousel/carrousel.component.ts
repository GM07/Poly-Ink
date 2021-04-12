import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/popups/new-drawing';
import { ServerCommunicationService } from '@app/services/server-communication/server-communication.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
    animations: [
        trigger('translationState', [
            state(
                'left',
                style({
                    transform: 'translateX(-250px)',
                }),
            ),
            state(
                'right',
                style({
                    transform: 'translateX(250px)',
                }),
            ),
            state(
                'reset',
                style({
                    transform: 'translateX(0px)',
                }),
            ),
            transition('* => right', animate('300ms ease-out')),
            transition('* => left', animate('300ms ease-out')),
            transition('* => reset', animate('0ms')),
        ]),
    ],
})
export class CarrouselComponent implements OnInit {
    static readonly SHORTCUT: ShortcutKey = new ShortcutKey('g', true);
    private static readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private static readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    private static readonly NOT_FOUND_ERROR: number = 404;
    @ViewChild('overflowLeftPreview', { static: false }) private overflowLeftPreview: ElementRef<HTMLImageElement>;
    @ViewChild('leftPreview', { static: false }) private leftPreview: ElementRef<HTMLImageElement>;
    @ViewChild('middlePreview', { static: false }) private middlePreview: ElementRef<HTMLImageElement>;
    @ViewChild('rightPreview', { static: false }) private rightPreview: ElementRef<HTMLImageElement>;
    @ViewChild('overflowRightPreview', { static: false }) private overflowRightPreview: ElementRef<HTMLImageElement>;
    readonly CARROUSEL_URL: string = 'carrousel';
    readonly CANVAS_PREVIEW_SIZE: number = 200;

    readonly overflowLeftElement: Drawing = new Drawing(new DrawingData(''));
    readonly leftElement: Drawing = new Drawing(new DrawingData(''));
    readonly middleElement: Drawing = new Drawing(new DrawingData(''));
    readonly rightElement: Drawing = new Drawing(new DrawingData(''));
    readonly overflowRightElement: Drawing = new Drawing(new DrawingData(''));

    private loadedImage: HTMLImageElement;
    currentURL: string;
    deletionErrorMessage: string;
    showCarrousel: boolean;
    showLoadingError: boolean;
    showLoadingWarning: boolean;
    serverConnexionError: boolean;
    isLoadingCarrousel: boolean;
    isOnline: boolean;
    hasDrawings: boolean;
    tagsFocused: boolean;
    translationState: string | null;
    drawingsList: Drawing[];
    currentIndex: number;

    animationIsDone: boolean;

    constructor(
        private shortcutHandler: ShortcutHandlerService,
        private drawingService: DrawingService,
        private serverCommunicationService: ServerCommunicationService,
        private router: Router,
        private cd: ChangeDetectorRef,
        activatedRoute: ActivatedRoute,
    ) {
        this.drawingsList = [];
        this.currentIndex = 0;
        this.translationState = null;
        this.animationIsDone = false;
        this.showCarrousel = false;
        this.showLoadingError = false;
        this.showLoadingWarning = false;
        this.serverConnexionError = false;
        this.tagsFocused = false;
        this.hasDrawings = true;
        this.subscribeActivatedRoute(activatedRoute);
    }

    ngOnInit(): void {
        this.serverCommunicationService.testConnection().subscribe((isOnline) => (this.isOnline = isOnline));
        if (this.isOnline && this.showCarrousel) {
            this.loadCarrousel();
        }
    }

    translationDone(): void {
        if (this.translationState === 'reset') {
            this.animationIsDone = true;
            return;
        }

        this.updateDrawingContent();
        this.translationState = 'reset';
    }

    // Clicking on the left will bring the element on the left
    clickLeft(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex - 1 + this.drawingsList.length) % this.drawingsList.length;
        this.animationIsDone = false;
        this.showLoadingError = false;
        this.translationState = 'right';
    }

    // Clicking on the right will bring the element on the right
    clickRight(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex + 1) % this.drawingsList.length;
        this.animationIsDone = false;
        this.showLoadingError = false;
        this.translationState = 'left';
    }

    closeCarrousel(): void {
        this.isLoadingCarrousel = false;
        this.showLoadingWarning = false;
        this.showLoadingError = false;
        this.showCarrousel = false;
        this.deletionErrorMessage = '';
        this.shortcutHandler.blockShortcuts = false;
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('home');
        }
    }

    deleteDrawing(): void {
        if (!this.animationIsDone) return;
        if (this.drawingsList.length === 0) {
            this.hasDrawings = false;
            return;
        }
        this.serverCommunicationService.deleteDrawing(this.drawingsList[this.currentIndex]).subscribe(
            () => {
                this.deleteAndUpdate();
            },
            (error) => {
                if (error.status === CarrouselComponent.NOT_FOUND_ERROR) {
                    this.deleteAndUpdate();
                    return;
                }
                this.isLoadingCarrousel = false;
                this.serverConnexionError = true;
            },
        );
    }
    loadDrawing(indexOffset: number): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        this.currentIndex = index;
        this.updateDrawingContent();

        let selectedDrawingSource: string | undefined = this.getImageAtIndex(index);
        if (selectedDrawingSource === undefined) {
            this.showLoadingError = true;
            return;
        }

        selectedDrawingSource = 'data:image/png;base64,' + selectedDrawingSource;

        if (
            this.currentURL !== this.CARROUSEL_URL &&
            !this.showLoadingWarning &&
            NewDrawingService.isNotEmpty(this.drawingService.baseCtx, this.drawingService.canvas.width, this.drawingService.canvas.height)
        ) {
            this.showLoadingWarning = true;
            return;
        }

        this.loadedImage = new Image();
        this.loadedImage.onload = this.createLoadedCanvas;
        this.loadedImage.src = selectedDrawingSource;
        this.isLoadingCarrousel = true;
        this.cd.detectChanges();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.shortcutHandler.blockShortcuts && CarrouselComponent.SHORTCUT.equals(event) && !this.showCarrousel) {
            event.preventDefault();
            this.shortcutHandler.blockShortcuts = true;
            this.showCarrousel = true;
            this.loadCarrousel();
        }

        if (this.showCarrousel && !this.showLoadingWarning && !this.tagsFocused) {
            if (CarrouselComponent.LEFT_ARROW.equals(event)) {
                this.clickLeft();
            } else if (CarrouselComponent.RIGHT_ARROW.equals(event)) {
                this.clickRight();
            }
        }
    }

    updateDrawingContent(): void {
        const overFlowLeft = -2;
        const left = -1;
        this.updateSingleDrawingContent(this.overflowLeftPreview, overFlowLeft, this.overflowLeftElement);
        this.updateSingleDrawingContent(this.leftPreview, left, this.leftElement);
        this.updateSingleDrawingContent(this.middlePreview, 0, this.middleElement);
        this.updateSingleDrawingContent(this.rightPreview, 1, this.rightElement);
        this.updateSingleDrawingContent(this.overflowRightPreview, 2, this.overflowRightElement);
    }

    serverConnexionIn(serverError: boolean): void {
        this.serverConnexionError = serverError;
    }

    loadFilteredCarrousel(filteredDrawings: Drawing[]): void {
        this.currentIndex = 0;
        this.drawingsList = filteredDrawings;
        this.cd.detectChanges();
        this.updateDrawingContent();
    }

    private updateSingleDrawingContent(imageRef: ElementRef<HTMLImageElement>, indexOffset: number, drawingContent: Drawing): void {
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        const drawingData = this.getImageAtIndex(index);

        if (this.drawingsList.length === 0) {
            drawingContent.data._id = '';
            drawingContent.data.name = '';
            drawingContent.data.tags = [];
        } else {
            drawingContent.data._id = this.drawingsList[index].data._id;
            drawingContent.data.name = this.drawingsList[index].data.name;
            drawingContent.data.tags = this.drawingsList[index].data.tags;
        }
        if (imageRef) imageRef.nativeElement.src = drawingData === undefined ? 'data:,' : 'data:image/png;base64,' + drawingData;
    }

    private subscribeActivatedRoute(activatedRoute: ActivatedRoute): void {
        activatedRoute.url.subscribe((url: UrlSegment[]) => {
            this.currentURL = url[0].path;
            if (this.currentURL === this.CARROUSEL_URL) {
                this.showCarrousel = true;
            }
        });
    }

    private createLoadedCanvas = () => {
        const canvas = document.createElement('canvas');
        const canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = this.loadedImage.width;
        canvas.height = this.loadedImage.height;
        canvasCTX.drawImage(this.loadedImage, 0, 0);
        this.drawingService.loadedCanvas = canvas;

        this.closeCarrousel();
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('editor');
        } else {
            this.drawingService.loadDrawing();
        }
        // tslint:disable-next-line:semicolon
    };

    private deleteAndUpdate(): void {
        this.drawingsList.splice(this.currentIndex, 1);
        if (this.currentIndex === this.drawingsList.length && this.drawingsList.length !== 0) --this.currentIndex;
        if (this.drawingsList.length === 0) this.hasDrawings = false;
        this.updateDrawingContent();
    }

    private getImageAtIndex(index: number): string | undefined {
        if (this.drawingsList.length === 0) return undefined;
        return this.drawingsList[index].image;
    }

    private loadCarrousel(): void {
        this.isLoadingCarrousel = true;
        this.serverConnexionError = false;
        this.cd.detectChanges(); // Must detect changes before loading

        this.serverCommunicationService.getAllDrawings().subscribe(
            (drawings: Drawing[]) => {
                this.drawingsList = drawings;
                this.hasDrawings = this.drawingsList.length > 0;
                this.isLoadingCarrousel = false;
                this.cd.detectChanges(); // Must detect changes when finished loading
                this.updateDrawingContent();
            },
            () => {
                this.isLoadingCarrousel = false;
                this.serverConnexionError = true;
            },
        );
    }
}
