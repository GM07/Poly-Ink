import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    animations: [
        trigger('fade', [
            state('visible', style({ opacity: 1 })),
            state('invisible', style({ opacity: 0 })),
            transition('visible=> invisible', animate('500ms ease-out')),
            transition('invisible => visible', animate('500ms ease-in')),
        ]),
    ],
})
export class HomePageComponent {
    state: OpacityState;
    showComponent: boolean;
    showContinueDrawing: boolean;

    constructor(private router: Router, private zone: NgZone, private drawingService: DrawingService) {
        this.init();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (CarrouselComponent.SHORTCUT.equals(event)) {
            event.preventDefault();
            this.openCarrousel();
        }
    }

    init(): void {
        this.state = 'visible';
        this.showContinueDrawing = this.drawingService.getSavedDrawing() !== null;
        this.showComponent = true;
    }

    // Function called when the create new drawing button is pressed
    createNewDrawing(): void {
        this.fadeOut();
        this.drawingService.setIsDoneReloading();
        this.drawingService.removeSavedDrawing();
        this.zone.run(() => this.router.navigateByUrl('editor'));
    }

    openCarrousel(): void {
        this.fadeOut();
        this.zone.run(() => this.router.navigateByUrl('carrousel'));
    }

    async continueDrawing(): Promise<void> {
        this.fadeOut();
        await this.drawingService.createLoadedCanvasFromStorage();
        this.zone.run(() => this.router.navigateByUrl('editor'));
    }

    backToMenu(): void {
        this.fadeIn();
    }

    fadeOut(): void {
        this.state = 'invisible';
    }

    fadeIn(): void {
        this.state = 'visible';
    }

    // When an animation is done, show component or not according to state
    endOfFadeAnimation(): void {
        this.showComponent = this.state === 'visible';
    }
}

type OpacityState = 'visible' | 'invisible';
