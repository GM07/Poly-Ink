import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/popups/new-drawing';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

export interface DrawingContent {
    drawingID: string;
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

    readonly overflowLeftElement: DrawingContent = {} as DrawingContent;
    readonly leftElement: DrawingContent = {} as DrawingContent;
    readonly middleElement: DrawingContent = {} as DrawingContent;
    readonly rightElement: DrawingContent = {} as DrawingContent;
    readonly overflowRightElement: DrawingContent = {} as DrawingContent;

    currentURL: string;
    deletionErrorMessage: string;
    showDeletionError: boolean;
    showCarrousel: boolean;
    showLoadingError: boolean;
    showLoadingWarning: boolean;
    isLoadingCarrousel: boolean;
    translationState: string | null;
    drawingsList: DrawingContent[];
    currentIndex: number;

    animationIsDone: boolean;

    constructor(
        private shortcutHandler: ShortcutHandlerService,
        private drawingService: DrawingService,
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
        this.subscribeActivatedRoute(activatedRoute);
    }

    ngOnInit(): void {
        if (this.showCarrousel) this.loadCarrousel();
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

        const currentDrawingName = this.drawingsList[this.currentIndex].name;
        this.drawingsList.splice(this.currentIndex, 1);
        if (this.currentIndex === this.drawingsList.length && this.drawingsList.length !== 0) --this.currentIndex;
        this.updateDrawingContent();

        let deletionError = false;
        this.showDeletionError = deletionError;
        this.deletionErrorMessage = '';
        if (deletionError) this.deletionErrorMessage = 'Erreur lors de la suppression du dessin ' + currentDrawingName;

        // TODO: Supprimer un dessin
    }

    loadDrawing(indexOffset: number): void {
        if (!this.animationIsDone || this.drawingsList.length === 0) return;
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        this.currentIndex = index;
        this.updateDrawingContent();

        const selectedDrawingSource = this.getDrawingFromServer(index);
        if (selectedDrawingSource === undefined) {
            this.showLoadingError = true;
            return;
        }

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

    private updateDrawingContent(): void {
        const overFlowLeft = -2;
        const left = -1;
        this.updateSingleDrawingContent(this.overflowLeftPreview, overFlowLeft, this.overflowLeftElement);
        this.updateSingleDrawingContent(this.leftPreview, left, this.leftElement);
        this.updateSingleDrawingContent(this.middlePreview, 0, this.middleElement);
        this.updateSingleDrawingContent(this.rightPreview, 1, this.rightElement);
        this.updateSingleDrawingContent(this.overflowRightPreview, 2, this.overflowRightElement);
    }

    private updateSingleDrawingContent(imageRef: ElementRef<HTMLImageElement>, indexOffset: number, drawingContent: DrawingContent): void {
        const index = (this.currentIndex + indexOffset + 2 * this.drawingsList.length) % this.drawingsList.length;
        const drawingData = this.getDrawingFromServer(index);

        if (this.drawingsList.length === 0) {
            drawingContent.drawingID = '';
            drawingContent.name = '';
            drawingContent.tags = [];
        } else {
            drawingContent.drawingID = this.drawingsList[index].drawingID;
            drawingContent.name = this.drawingsList[index].name;
            drawingContent.tags = this.drawingsList[index].tags;
        }

        imageRef.nativeElement.src = drawingData === undefined ? '' : drawingData;
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

    private getDrawingFromServer(index: number): string | undefined {
        if (this.drawingsList.length === 0) return undefined;
        return this.idAndBase64Drawing.get(this.drawingsList[index].drawingID);
    }

    // TODO: This is for testing purposes only
    private idAndBase64Drawing = new Map<string, string>();

    // tslint:disable:no-magic-numbers
    private loadCarrousel(): void {
        this.isLoadingCarrousel = true;
        this.cd.detectChanges(); // Must detect changes before loading

        // TODO: This will be replaced with a server request for the saved drawings
        // This current code is only usefull to test the current code logic
        // c1 to c5 created for testing
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

        this.idAndBase64Drawing.set('c1id', c1.toDataURL());
        this.idAndBase64Drawing.set('c2id', c2.toDataURL());
        this.idAndBase64Drawing.set('c3id', c3.toDataURL());
        this.idAndBase64Drawing.set('c4id', c4.toDataURL());
        this.idAndBase64Drawing.set('c5id', c5.toDataURL());

        this.drawingsList = [
            {
                drawingID: 'c1id',
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
            { drawingID: 'error', name: 'cError', tags: ['tagcError'] } as DrawingContent,
            { drawingID: 'c2id', name: 'c2', tags: ['tagc2'] } as DrawingContent,
            {
                drawingID: 'c3id',
                name: 'c3',
                tags: ['this tag is way too long, so it should be broken for an appropriate display'],
            } as DrawingContent,
            {
                drawingID: 'c4id',
                name: 'c4',
                tags: ['tagc4'],
            } as DrawingContent,
            {
                drawingID: 'c5id',
                name: 'c5',
                tags: ['tagc5'],
            } as DrawingContent,
        ];

        this.isLoadingCarrousel = false;
        this.cd.detectChanges(); // Must detect changes when finished loading
        this.updateDrawingContent();
    }
}
