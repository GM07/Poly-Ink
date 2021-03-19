import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/popups/new-drawing';
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
    @ViewChild('overflowLeftPreview', { static: false }) overflowLeftPreview: ElementRef<HTMLImageElement>;
    @ViewChild('leftPreview', { static: false }) leftPreview: ElementRef<HTMLImageElement>;
    @ViewChild('middlePreview', { static: false }) middlePreview: ElementRef<HTMLImageElement>;
    @ViewChild('rightPreview', { static: false }) rightPreview: ElementRef<HTMLImageElement>;
    @ViewChild('overflowRightPreview', { static: false }) overflowRightPreview: ElementRef<HTMLImageElement>;

    private readonly SHORTCUT: ShortcutKey = new ShortcutKey('g', true);
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    readonly CARROUSEL_URL: string = 'carrousel';
    readonly CANVAS_PREVIEW_SIZE: number = 200;

    readonly overflowLeftElement: Drawing = new Drawing(new DrawingData(''));
    readonly leftElement: Drawing = new Drawing(new DrawingData(''));
    readonly middleElement: Drawing = new Drawing(new DrawingData(''));
    readonly rightElement: Drawing = new Drawing(new DrawingData(''));
    readonly overflowRightElement: Drawing = new Drawing(new DrawingData(''));

    currentURL: string;
    deletionErrorMessage: string;
    showDeletionError: boolean;
    showCarrousel: boolean;
    showLoadingError: boolean;
    showLoadingWarning: boolean;
    serverConnexionError: boolean;
    isLoadingCarrousel: boolean;
    isOnline: boolean;
    translationState: string | null;
    drawingsList: Drawing[];
    currentIndex: number;

    animationIsDone: boolean;

    constructor(
        private shortcutHandler: ShortcutHandlerService,
        private drawingService: DrawingService,
        private carrouselService: CarrouselService,
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
        this.showDeletionError = false;
        this.serverConnexionError = false;
        this.subscribeActivatedRoute(activatedRoute);
    }

    ngOnInit(): void {
        this.carrouselService.testConnection().subscribe(isOnline => this.isOnline = isOnline);
        if (this.isOnline) {
            if (this.showCarrousel) this.loadCarrousel();
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
        this.showDeletionError = false;
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
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        
        this.carrouselService.deleteDrawing(this.drawingsList[this.currentIndex])
        .subscribe(() => {
            const currentDrawingName = this.drawingsList[this.currentIndex].data.name;
            this.drawingsList.splice(this.currentIndex, 1);
            if (this.currentIndex === this.drawingsList.length && this.drawingsList.length !== 0) --this.currentIndex;
            this.updateDrawingContent();
    
            let deletionError = false;
            this.showDeletionError = deletionError;
            this.deletionErrorMessage = '';
            if (deletionError) this.deletionErrorMessage = 'Erreur lors de la suppression du dessin ' + currentDrawingName;
        })
    }

    loadDrawing(indexOffset: number): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        this.currentIndex = index;
        this.updateDrawingContent();

        let selectedDrawingSource: string | undefined = this.getDrawingFromServer(index);
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

        const loadedImage = new Image();
        loadedImage.onload = () => {
            this.createLoadedCanvas(loadedImage);
        };
        loadedImage.src = selectedDrawingSource;
        this.isLoadingCarrousel = true;
        this.cd.detectChanges();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.shortcutHandler.blockShortcuts && this.SHORTCUT.equals(event) && !this.showCarrousel) {
            event.preventDefault();
            this.shortcutHandler.blockShortcuts = true;
            this.showCarrousel = true;
            this.loadCarrousel();
        }

        if (this.showCarrousel && !this.showLoadingWarning) {
            if (this.LEFT_ARROW.equals(event)) {
                this.clickLeft();
            } else if (this.RIGHT_ARROW.equals(event)) {
                this.clickRight();
            }
        }
    }

    private subscribeActivatedRoute(activatedRoute: ActivatedRoute): void {
        activatedRoute.url.subscribe((url: UrlSegment[]) => {
            this.currentURL = url[0].path;
            if (this.currentURL === this.CARROUSEL_URL) {
                this.showCarrousel = true;
            }
        });
    }

    public updateDrawingContent(): void {
        const overFlowLeft = -2;
        const left = -1;
        this.updateSingleDrawingContent(this.overflowLeftPreview, overFlowLeft, this.overflowLeftElement);
        this.updateSingleDrawingContent(this.leftPreview, left, this.leftElement);
        this.updateSingleDrawingContent(this.middlePreview, 0, this.middleElement);
        this.updateSingleDrawingContent(this.rightPreview, 1, this.rightElement);
        this.updateSingleDrawingContent(this.overflowRightPreview, 2, this.overflowRightElement);
    }

    private updateSingleDrawingContent(imageRef: ElementRef<HTMLImageElement>, indexOffset: number, drawingContent: Drawing): void {
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        const drawingData = this.getDrawingFromServer(index);

        if (this.drawingsList.length === 0) {
            drawingContent.data._id = '';
            drawingContent.data.name = '';
            drawingContent.data.tags = [];
        } else {
            drawingContent.data._id = this.drawingsList[index].data._id;
            drawingContent.data.name = this.drawingsList[index].data.name;
            drawingContent.data.tags = this.drawingsList[index].data.tags;
        }

        imageRef.nativeElement.src = drawingData === undefined ? 'data:,' : 'data:image/png;base64,' + drawingData;
    }

    private createLoadedCanvas(loadedImage: HTMLImageElement): void {
        const canvas = document.createElement('canvas');
        const canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = loadedImage.width;
        canvas.height = loadedImage.height;
        canvasCTX.drawImage(loadedImage, 0, 0);
        this.drawingService.loadedCanvas = canvas;

        this.closeCarrousel();
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('editor');
        } else {
            this.drawingService.loadDrawing();
        }
    }

    // Ecq c'est vraiment un bon nom pour cette fonction??
    private getDrawingFromServer(index: number): string | undefined {
        if (this.drawingsList.length === 0) return undefined;
        return this.drawingsList[index].image;
    }

    public loadFilteredCarrousel(filteredDrawings: Drawing[]): void {
        this.drawingsList = filteredDrawings;
        this.updateDrawingContent();
    }

    private loadCarrousel(): void {
        this.isLoadingCarrousel = true;
        this.cd.detectChanges(); // Must detect changes before loading

        this.carrouselService.getAllDrawings().subscribe(
            (drawings: Drawing[]) => {
            this.drawingsList = drawings;
            this.isLoadingCarrousel = false;
            this.cd.detectChanges(); // Must detect changes when finished loading
            this.updateDrawingContent();
            },
            () => {
                this.isLoadingCarrousel = false;
                this.serverConnexionError = true;
            }
        );
    }
}
