import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawing } from '@app/services/popups/new-drawing';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

export interface DrawingContent {
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
    showLoadingError: boolean;
    showLoadingWarning: boolean;
    isLoadingCarrousel: boolean;
    translationState: string | null;
    drawingsList: DrawingContent[] = [];
    currentIndex: number;

    overflowLeftElement: DrawingContent = {} as DrawingContent;
    leftElement: DrawingContent = {} as DrawingContent;
    middleElement: DrawingContent = {} as DrawingContent;
    rightElement: DrawingContent = {} as DrawingContent;
    overflowRightElement: DrawingContent = {} as DrawingContent;

    private animationIsDone: boolean;

    constructor(
        private shortcutHandler: ShortcutHandlerService,
        private drawingService: DrawingService,
        private router: Router,
        private cd: ChangeDetectorRef,
        activatedRoute: ActivatedRoute,
    ) {
        this.currentIndex = 0;
        this.translationState = null;
        this.animationIsDone = false;
        this.showCarrousel = false;
        this.showLoadingError = false;
        this.showLoadingWarning = false;
        this.subscribeActivatedRoute(activatedRoute);
    }

    ngOnInit(): void {
        if (!this.showCarrousel) return;
        this.loadCarrousel();
    }

    translationDone(): void {
        if (this.translationState === 'reset') {
            this.animationIsDone = true;
            return;
        }

        this.updateCanvasPreview();
        this.translationState = 'reset';
    }

    private subscribeActivatedRoute(activatedRoute: ActivatedRoute): void {
        activatedRoute.url.subscribe((url: UrlSegment[]) => {
            this.currentURL = url[0].path;
            if (this.currentURL === this.CARROUSEL_URL) {
                this.showCarrousel = true;
            }
        });
    }

    private updateCanvasPreview(): void {
        if (this.drawingsList.length === 0) return;

        const overFlowLeft = -2;
        const left = -1;
        this.updateSingleDrawingContent(this.overflowLeftPreview, overFlowLeft, this.overflowLeftElement);
        this.updateSingleDrawingContent(this.leftPreview, left, this.leftElement);
        this.updateSingleDrawingContent(this.middlePreview, 0, this.middleElement);
        this.updateSingleDrawingContent(this.rightPreview, 1, this.rightElement);
        this.updateSingleDrawingContent(this.overflowRightPreview, 2, this.overflowRightElement);
    }

    private updateSingleDrawingContent(canvasRef: ElementRef<HTMLCanvasElement>, indexOffset: number, drawingContent: DrawingContent): void {
        const ctx = canvasRef.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        const aspectRatio = this.drawingsList[index].canvas.width / this.drawingsList[index].canvas.height;

        let leftOffset = 0;
        let topOffset = 0;
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

    // Quand on clique à gauche, c'est pour avoir l'élément à gauche
    clickLeft(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex - 1 + this.drawingsList.length) % this.drawingsList.length;
        this.animationIsDone = false;
        this.translationState = 'right';
    }

    // Quand on clique à droite, c'est pour avoir l'élément à droite
    clickRight(): void {
        if (!this.animationIsDone) return;

        this.currentIndex = (this.currentIndex + 1) % this.drawingsList.length;
        this.animationIsDone = false;
        this.translationState = 'left';
    }

    closeCarrousel(): void {
        this.showLoadingWarning = false;
        this.showCarrousel = false;
        this.showLoadingError = false;
        this.shortcutHandler.blockShortcuts = false;
        if (this.currentURL === this.CARROUSEL_URL) {
            this.router.navigateByUrl('home');
        }
    }

    // tslint:disable:no-magic-numbers
    private loadCarrousel(): void {
        this.isLoadingCarrousel = true;
        this.cd.detectChanges(); // Must detect changes before loading

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
        c3.width = 400;
        c3.height = 200;
        const ctxc3 = c3.getContext('2d');
        if (ctxc3 !== null) {
            ctxc3.fillStyle = 'blue';
            ctxc3.fillRect(0, 0, 400, 200);
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
            {
                canvas: c1,
                name: 'c111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
                tags: [
                    'vGXlg6jwQk1111111111111111111111111111111111111111',
                    'v',
                    'es',
                    '2uIzu',
                    'ch9f4wl10f',
                    '38MYvlT5iB',
                    'R9OBJ2qbPF',
                    'wPrWzO7TsN',
                    '4p8Axg1i0l',
                    'JosB95dscO',
                    'U14JBKfCY3',
                    'OpYvV63lbb',
                    'Ibpwt98xmE',
                    'HmNSHoW3Yx',
                    'lC37c8WfjS',
                    'vlhcwTTZ52',
                    'j9nofJvDiz',
                    '2iohx3ySgJ',
                    'FQbnwjp6xU',
                    'NVwQ2x3NTw',
                    'BY9NDyLiLx',
                    '61GYM6nucr',
                    '1pSHrQydxK',
                    'ggMcWHoXPZ',
                    'pB2e6Zfqw9',
                    'RjggEx2N5r',
                    'xaNpYgV8ER',
                    'L0RRHcv2xa',
                    '7VyAkvtdbr',
                    'tJWTpNnG1m',
                    'x8RhwWfYoc',
                    'UFU0bsCW7a',
                    'OIdiWd00Ru',
                    'jHnlFbAVV0',
                    'eFWGX8233T',
                    'T4nuiVDB88',
                    '0e0SFmu6t1',
                    'bFZT4VbKhU',
                    'Lk8BZtxJB9',
                    'WhYtxs43zR',
                    'k9OKb0pb18',
                    'lSZ82q7yv4',
                    'q5gnUP05sQ',
                    's9lIFQI5Sj',
                    'ZCaxZOyLaP',
                    'eCVVpzRRY2',
                    'ov7tuNkNF5',
                    'yRTWgy76Bt',
                    'SKdbWYVGTF',
                    'LFfoC6LmN7',
                    'uA4G16jC0v',
                    'hX3rFqDNkj',
                    'XCOco9aknH',
                    '3nO73XB4kj',
                    'sfEbGj1Sgf',
                    'mNUHgK45dk',
                    'C0sQbg33Jv',
                    'UM8gPFapk4',
                    'EBCHZ8XjZU',
                    'ywImvJ6OFi',
                    '0QnvMtULGE',
                    'AQV2iojPaC',
                    'UJnYt6PaWq',
                    'cmXINs6cYe',
                    'yzXClnzQaq',
                    'HOecKyHZRj',
                    'py1P1AWK1e',
                    'yuhCBAViOW',
                    '2vahjSK3j7',
                    '00dtpBmcXI',
                    'aTHWGOl0pE',
                    'Fa7udfxK5G',
                    'EKMfttJh3M',
                    'hssiRE9gEW',
                    'caaxJOpABG',
                    'sTV6DRejGM',
                    'C3nZO0uWo1',
                    'WcrO6qLzea',
                    '9Kf8V0qlJj',
                    'dEr4P2BsCV',
                    '4GCQGRgfxs',
                    '3VRmEmLKWY',
                    'cQj2hQ0L9Z',
                    'ngX0wRWT6b',
                    'J6L7d2NRuu',
                    'WV39ua0UNP',
                    'LKnZJ2BKhp',
                    'IMHjZ5d3ZA',
                    'L5TBvxmC2s',
                    'J79FMI7xHi',
                    'Y0qFMmLoqI',
                    'dW9umMKkIE',
                    'ECZUGvsO0r',
                    'VWDElTyU5d',
                    'qxAhvbpmCP',
                    'Y7zgrNfkYp',
                    'pEoMcK5GGk',
                    'q2m8VQ75LD',
                    'BYVSkurZXB',
                    'XAzRnUVZDM',
                    'Ooo1KoGxpo',
                    'fu0g9V9sPd',
                    'RTlm6B4O8P',
                    'KdivRoqrpf',
                    '5CzFHE1ehB',
                    'IJhTao2ytT',
                    'b8UYT6c30B',
                    'foIA9qO1hS',
                    'gechzXzzfZ',
                    'UQcJwkWV52',
                    'rALUmjvFdO',
                    'sLTEW805WX',
                    'ckgTgUyBb2',
                    'kjcUfGaD3f',
                    '6fjHusLJRa',
                    'ywsw9P4Fmz',
                    'CNdVYGw6kZ',
                    'kPEIMnSzFf',
                    'I1DWVFpzTS',
                    'DXE4yeK35V',
                    'LCw2MzfhxZ',
                    'bZcs8KLruT',
                    '65iDlkijE8',
                    'oyUApFHBDH',
                    '95NLYqOeUV',
                    'nNzWyPJxSC',
                    'NvFXA8OLuV',
                    'tif5ILJIkZ',
                    'CmBbbv4mIK',
                    'aXYhXTRV5V',
                    '5mihRYDxvZ',
                    'j00M0Qd6VC',
                    '1YI4PmUEO2',
                    'P11HLkUNOu',
                    'kNr4mFr2ny',
                    '133FTiLjc2',
                    'fK3anNdHG4',
                    'Wg6q7HZ8PV',
                    '9F8pPYUKfc',
                    'URAlyranUh',
                    'I9YAjpmZiP',
                    'Wem27rav7k',
                    '5T2gLByLjS',
                    '5z1W0h1BLd',
                    'SiBbiwfp6K',
                    'KA9U4V8tPL',
                    'U0VLUoEaNj',
                    'zbMtTcmuVr',
                    '06ZLXLQwgo',
                    'J1kyQYDR0g',
                    'LbMCHyzdfx',
                    'Upa5pgNBhS',
                    'tbEao3JWlI',
                    'qPWavPapmx',
                    'xA3qDwzmXu',
                    'uzANV5uAkx',
                    'x8tGfkJVYW',
                    'n6UoZiaLc6',
                    '1yWmMJ6pwf',
                    '8RCzUJXVkG',
                    '1o9SyCHlwp',
                    'uYsg2OzRbh',
                    '0kCCJZ4h0W',
                    'h5jtg3Xgdo',
                    'bHYCrNhckN',
                    'yYRIdsfNmP',
                    'W8XpWqG8f7',
                    'Dke0IAcfie',
                    'R6hx1WJ7f8',
                    'wWBlCrZpuU',
                    'Zi08pOGSgx',
                    'BtbMpLXsWB',
                    '1jEf71Cxt5',
                    'PjIxDmRjs1',
                    'Y5bFtCIjyw',
                    '0EZXYbZdi4',
                    'DAdclqsj3E',
                    'P0xsdXyxsE',
                    'NyyE0GXXlE',
                    'Ytvq4tCp4O',
                    'nbMnDO7LNR',
                    '4GJ13oV69g',
                    'lViOlRmjya',
                    'JSQjF6C0WW',
                    'vWf6wzEK13',
                    'caId0RfvxZ',
                    'DZuuggTWr9',
                    'kvNUIA1OFA',
                    'x8ldrMXruk',
                    'AwvX9QutuJ',
                    'nP4FdY9sFH',
                    '3VOtKFD8RR',
                    'TgG9LVyiAn',
                    'iKUeVPcZbX',
                    'Ro1CsVFiiu',
                    'mBHqSH8kxq',
                    '4tGX6gsC7Y',
                    'UZa6g9Pgpn',
                    '0QFnaY833Z',
                    'YVQm5nLE8q',
                ],
            } as DrawingContent,
            { canvas: c2, name: 'c2', tags: ['tagc2'] } as DrawingContent,
            { canvas: c3, name: 'c3', tags: ['this tag is way too long, so it should be broken for an appropriate display'] } as DrawingContent,
        ];

        this.isLoadingCarrousel = false;
        this.cd.detectChanges(); // Must detect changes when finished loading
        this.updateCanvasPreview();
    }

    loadDrawing(indexOffset: number): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        this.currentIndex = index;
        this.updateCanvasPreview();

        if (this.drawingsList[index].canvas === undefined) {
            this.showLoadingError = true;
            return;
        }

        if (
            this.currentURL !== this.CARROUSEL_URL &&
            !this.showLoadingWarning &&
            NewDrawing.isNotEmpty(this.drawingService.baseCtx, this.drawingService.canvas.width, this.drawingService.canvas.height)
        ) {
            this.showLoadingWarning = true;
            return;
        }

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
        // TODO: Supprimer un dessin
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
}
