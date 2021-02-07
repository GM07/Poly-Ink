import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    animations: [
        trigger('fade', [
            state('visible', style({ opacity: 1 })),
            state('invisible', style({ opacity: 0 })),
            transition('visible=> invisible', animate('500ms ease-out')),
            transition('invisible => visible', animate('500ms ease-in')),
        ]),
    ],
})
export class MainMenuComponent implements OnInit {
    state: OpacityState = 'visible';
    showComponent: boolean = true;

    constructor(private router: Router) {
        //
    }

    ngOnInit(): void {
        //
    }

    // Function called when the create new drawing button is pressed
    createNewDrawing(): void {
        this.fadeOut();
        this.router.navigateByUrl('editor');
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
