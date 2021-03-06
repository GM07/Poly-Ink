import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
    animations: [
        trigger('translationState', [
            state(
                'left',
                style({
                    transform: 'translateX(-150px)',
                }),
            ),
            state(
                'right',
                style({
                    transform: 'translateX(150px)',
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
            transition('* => reset', animate('0ms ease-out')),
        ]),
    ],
})
export class CarrouselComponent implements AfterViewInit {
    @ViewChild('overflowLeftPreview', { static: false }) overflowLeftPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('leftPreview', { static: false }) leftPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('middlePreview', { static: false }) middlePreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('rightPreview', { static: false }) rightPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('overflowRightPreview', { static: false }) overflowRightPreview: ElementRef<HTMLCanvasElement>;

    private readonly SHORTCUT: ShortcutKey = new ShortcutKey('g', true);
    readonly CARROUSEL_URL = 'carrousel';
    currentURL: string;
    showCarrousel: boolean;
    translationState: string | null = null;
    canvasList: HTMLCanvasElement[] = [];
    currentIndex: number = 0;
    private animationIsDone: boolean = false;

    constructor(private shortcutHandler: ShortcutHandlerService, private router: Router, activatedRoute: ActivatedRoute) {
        this.showCarrousel = false;
        activatedRoute.url.subscribe((url: UrlSegment[]) => {
            this.currentURL = url[0].path;
            if (this.currentURL === this.CARROUSEL_URL) {
                this.showCarrousel = true;
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.showCarrousel) {
            console.log('init');
            this.initTest();
        }
    }

    // TODO: Va être remplacé par la requète de dessins sauvegardés
    // Ceci n'est utile que pour tester le fonctionnement.
    initTest(): void {
        this.leftPreview.nativeElement.width = 100;
        this.leftPreview.nativeElement.height = 100;

        this.middlePreview.nativeElement.width = 100;
        this.middlePreview.nativeElement.height = 100;

        this.rightPreview.nativeElement.width = 100;
        this.rightPreview.nativeElement.height = 100;

        this.overflowLeftPreview.nativeElement.width = 100;
        this.overflowLeftPreview.nativeElement.height = 100;

        this.overflowRightPreview.nativeElement.width = 100;
        this.overflowRightPreview.nativeElement.height = 100;

        // c1 à c3 créés pour tester
        const c1 = document.createElement('canvas');
        c1.width = 100;
        c1.height = 100;
        const ctxc1 = c1.getContext('2d');
        if (ctxc1 !== null) {
            ctxc1.fillStyle = 'red';
            ctxc1.fillRect(0, 0, 100, 100);
        }

        const c2 = document.createElement('canvas');
        c2.width = 100;
        c2.height = 100;
        const ctxc2 = c2.getContext('2d');
        if (ctxc2 !== null) {
            ctxc2.fillStyle = 'green';
            ctxc2.fillRect(0, 0, 100, 100);
        }

        const c3 = document.createElement('canvas');
        c3.width = 100;
        c3.height = 100;
        const ctxc3 = c3.getContext('2d');
        if (ctxc3 !== null) {
            ctxc3.fillStyle = 'blue';
            ctxc3.fillRect(0, 0, 100, 100);
        }

        const c4 = document.createElement('canvas');
        c4.width = 100;
        c4.height = 100;
        const ctxc4 = c4.getContext('2d');
        if (ctxc4 !== null) {
            ctxc4.fillStyle = 'grey';
            ctxc4.fillRect(0, 0, 100, 100);
        }

        const c5 = document.createElement('canvas');
        c5.width = 100;
        c5.height = 100;
        const ctxc5 = c5.getContext('2d');
        if (ctxc5 !== null) {
            ctxc5.fillStyle = 'pink';
            ctxc5.fillRect(0, 0, 100, 100);
        }

        this.canvasList = [c1, c2, c3];
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
        if (this.canvasList.length === 0) return;
        const ctxLeftOverflow = this.overflowLeftPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const ctxLeft = this.leftPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const ctxMiddle = this.middlePreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const ctxRight = this.rightPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const ctxRightOverflow = this.overflowRightPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        const leftOverflow = (this.currentIndex - 2 + this.canvasList.length) % this.canvasList.length;
        const left = (this.currentIndex - 1 + this.canvasList.length) % this.canvasList.length;
        const right = (this.currentIndex + 1) % this.canvasList.length;
        const rightOverflow = (this.currentIndex + 2) % this.canvasList.length;

        ctxLeftOverflow.drawImage(this.canvasList[leftOverflow], 0, 0);
        ctxLeft.drawImage(this.canvasList[left], 0, 0);
        ctxMiddle.drawImage(this.canvasList[this.currentIndex], 0, 0);
        ctxRight.drawImage(this.canvasList[right], 0, 0);
        ctxRightOverflow.drawImage(this.canvasList[rightOverflow], 0, 0);
    }

    // Quand on clique à gauche, c'est pour avoir l'élément à droite
    clickLeft(): void {
        if (!this.animationIsDone) return;

        if (this.translationState === 'reset') this.currentIndex = (this.currentIndex + 1) % this.canvasList.length;
        this.animationIsDone = false;
        this.translationState = 'left';
    }

    // Quand on clique à droite, c'est pour avoir l'élément à gauche
    clickRight(): void {
        if (!this.animationIsDone) return;

        if (this.translationState === 'reset') this.currentIndex = (this.currentIndex - 1 + this.canvasList.length) % this.canvasList.length;
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

    replaceAll(): void {}

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.shortcutHandler.blockShortcuts && this.SHORTCUT.equals(event) && !this.showCarrousel) {
            event.preventDefault();
            this.shortcutHandler.blockShortcuts = true;
            this.showCarrousel = true;
            setTimeout(() => {
                this.initTest();
                this.updateCanvasPreview();
            }, 10);
        }
    }
}
