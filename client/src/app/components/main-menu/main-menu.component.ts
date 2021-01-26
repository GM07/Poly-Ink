import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    animations: [
        trigger('fade', [
            state('visible', style({ opacity: 1 })),
            state('invisible', style({ opacity: 0 })),
            transition('visible=> invisible', animate('500ms ease-out')),
            transition('invisible => visible', animate('500ms ease-out')),
        ]),
    ],
})
export class MainMenuComponent implements OnInit {
    state: OpacityState = 'visible';
    showComponent: boolean = true;

    constructor() {}

    ngOnInit(): void {}

    // Function called when the create new drawing button is pressed
    createNewDrawing(): void {
        console.log('Create new drawing');
        this.fadeOut();
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
    endOfFadeAnimation() {
        if (this.state == 'visible') {
            this.showComponent = true;
        } else {
            this.showComponent = false;
        }
    }
}

type OpacityState = 'visible' | 'invisible';
