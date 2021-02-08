import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
export class HomePageComponent implements OnInit {
    state: OpacityState = 'visible';
    showComponent: boolean = true;

    constructor(private router: Router, private zone: NgZone) {
        //
    }

    ngOnInit(): void {
        //
    }

    // Function called when the create new drawing button is pressed
    createNewDrawing(): void {
        this.fadeOut();
        this.zone.run(() => this.router.navigateByUrl('editor'));
    }

    backToMenu(): void {
        this.fadeIn();
    }

    continuingDrawing(): boolean {
        return false;
    }

    fadeOut(): void {
        this.state = 'invisible';
    }

    fadeIn(): void {
        this.state = 'visible';
    }

    // When an animation is done, show component or not according to state
    endOfFadeAnimation(): void {
        if (this.state === 'visible') {
            this.showComponent = true;
        } else {
            this.showComponent = false;
        }
    }
}

type OpacityState = 'visible' | 'invisible';
