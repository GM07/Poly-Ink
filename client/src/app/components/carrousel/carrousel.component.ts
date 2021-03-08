import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

interface DrawingContent {
    canvas: HTMLCanvasElement;
    name: string;
    tags: string[];
}

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
    @ViewChild('overflowLeftPreview', { static: false }) overflowLeftPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('leftPreview', { static: false }) leftPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('middlePreview', { static: false }) middlePreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('rightPreview', { static: false }) rightPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('overflowRightPreview', { static: false }) overflowRightPreview: ElementRef<HTMLCanvasElement>;

    private readonly SHORTCUT: ShortcutKey = new ShortcutKey('g', true);
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    readonly CARROUSEL_URL: string = 'carrousel';
    readonly CANVAS_PREVIEW_SIZE: number = 200;
    currentURL: string;
    showCarrousel: boolean;
    translationState: string | null = null;
    drawingsList: DrawingContent[] = [];
    currentIndex: number = 0;

    overflowLeftElement: DrawingContent = {} as DrawingContent;
    leftElement: DrawingContent = {} as DrawingContent;
    middleElement: DrawingContent = {} as DrawingContent;
    rightElement: DrawingContent = {} as DrawingContent;
    overflowRightElement: DrawingContent = {} as DrawingContent;

    private animationIsDone: boolean = false;

    constructor(
        private shortcutHandler: ShortcutHandlerService,
        private router: Router,
        activatedRoute: ActivatedRoute,
        private drawingService: DrawingService,
    ) {
        this.showCarrousel = false;
        activatedRoute.url.subscribe((url: UrlSegment[]) => {
            this.currentURL = url[0].path;
            if (this.currentURL === this.CARROUSEL_URL) {
                this.showCarrousel = true;
            }
        });
    }
    ngOnInit(): void {
        // TODO: Va être remplacé par la requète de dessins sauvegardés
        // Ceci n'est utile que pour tester le fonctionnement.
        // c1 à c5 créés pour tester
        const c1 = document.createElement('canvas');
        c1.width = 200;
        c1.height = 1000;
        const ctxc1 = c1.getContext('2d');
        if (ctxc1 !== null) {
            ctxc1.fillStyle = 'red';
            ctxc1.fillRect(0, 0, 200, 200);
            ctxc1.fillStyle = 'red';
            ctxc1.fillRect(0, 200, 200, 800);
        }

        const c2 = document.createElement('canvas');
        c2.width = 300;
        c2.height = 300;
        const ctxc2 = c2.getContext('2d');
        if (ctxc2 !== null) {
            ctxc2.fillStyle = 'green';
            ctxc2.fillRect(0, 0, 300, 300);
            ctxc2.fillStyle = 'lightblue';
            ctxc2.fillRect(0, 0, 100, 100);
        }

        const c3 = document.createElement('canvas');
        c3.width = 200;
        c3.height = 200;
        const ctxc3 = c3.getContext('2d');
        if (ctxc3 !== null) {
            ctxc3.fillStyle = 'blue';
            ctxc3.fillRect(0, 0, 200, 200);
        }

        const c4 = document.createElement('canvas');
        c4.width = 200;
        c4.height = 200;
        const ctxc4 = c4.getContext('2d');
        if (ctxc4 !== null) {
            ctxc4.fillStyle = 'grey';
            ctxc4.fillRect(0, 0, 200, 200);
        }

        const c5 = document.createElement('canvas');
        c5.width = 200;
        c5.height = 200;
        const ctxc5 = c5.getContext('2d');
        if (ctxc5 !== null) {
            ctxc5.fillStyle = 'pink';
            ctxc5.fillRect(0, 0, 200, 200);
        }

        this.drawingsList = [
            { canvas: c1, name: 'c1', tags: ['tagc1'] } as DrawingContent,
            { canvas: c2, name: 'c2', tags: ['tagc2'] } as DrawingContent,
            { canvas: c3, name: 'c3', tags: ['tagc3'] } as DrawingContent,
        ];
    }

    translationDone(): void {
        if (this.translationState === 'reset') {
            this.animationIsDone = true;
            return;
        }

        this.updateCanvasPreview();
        this.translationState = 'reset';
    }

    updateCanvasPreview(): void {
        if (this.drawingsList.length === 0) return;

        this.updateSingleDrawingContent(this.overflowLeftPreview, -2, this.overflowLeftElement);
        this.updateSingleDrawingContent(this.leftPreview, -1, this.leftElement);
        this.updateSingleDrawingContent(this.middlePreview, 0, this.middleElement);
        this.updateSingleDrawingContent(this.rightPreview, 1, this.rightElement);
        this.updateSingleDrawingContent(this.overflowRightPreview, 2, this.overflowRightElement);
    }

    updateSingleDrawingContent(canvasRef: ElementRef<HTMLCanvasElement>, indexOffset: number, drawingContent: DrawingContent): void {
        const ctx = canvasRef.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        const aspectRatio = this.drawingsList[index].canvas.width / this.drawingsList[index].canvas.height;

        let leftOffset: number = 0;
        let topOffset: number = 0;
        let width: number;
        let height: number;
        if (this.drawingsList[index].canvas.width > this.drawingsList[index].canvas.height) {
            width = this.CANVAS_PREVIEW_SIZE;
            height = this.CANVAS_PREVIEW_SIZE / aspectRatio;
            topOffset = (this.CANVAS_PREVIEW_SIZE - height) / 2;
        } else {
            height = this.CANVAS_PREVIEW_SIZE;
            width = this.CANVAS_PREVIEW_SIZE * aspectRatio;
            leftOffset = (this.CANVAS_PREVIEW_SIZE - width) / 2;
        }

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this.drawingsList[index].canvas, leftOffset, topOffset, width, height);

        drawingContent.canvas = this.drawingsList[index].canvas;
        drawingContent.name = this.drawingsList[index].name;
        drawingContent.tags = this.drawingsList[index].tags;
    }

    // Quand on clique à gauche, c'est pour avoir l'élément à droite
    clickLeft(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex + 1) % this.drawingsList.length;
        this.animationIsDone = false;
        this.translationState = 'left';
    }

    // Quand on clique à droite, c'est pour avoir l'élément à gauche
    clickRight(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex - 1 + this.drawingsList.length) % this.drawingsList.length;
        this.animationIsDone = false;
        this.translationState = 'right';
    }

    closeCarrousel(): void {
        this.showCarrousel = false;
        this.shortcutHandler.blockShortcuts = false;
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('home');
        }
    }

    loadDrawing(indexOffset: number): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        this.drawingService.loadedCanvas = this.drawingsList[index].canvas;
        this.closeCarrousel();
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('editor');
        } else {
            this.drawingService.loadDrawing();
        }
    }

    deleteDrawing(): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        // delete
        console.log(this.drawingsList[this.currentIndex].name);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.shortcutHandler.blockShortcuts && this.SHORTCUT.equals(event) && !this.showCarrousel) {
            event.preventDefault();
            this.shortcutHandler.blockShortcuts = true;
            this.showCarrousel = true;
            setTimeout(() => {
                this.updateCanvasPreview();
            }, 10);
        }

        if (this.showCarrousel) {
            if (this.LEFT_ARROW.equals(event)) {
                this.clickLeft();
            } else if (this.RIGHT_ARROW.equals(event)) {
                this.clickRight();
            }
        }
    }
}
