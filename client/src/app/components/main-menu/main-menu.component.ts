import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    animations: [
        trigger('fade', [
            state('in', style({ opacity: 1 })),
            state('out', style({ opacity: 0 })),
            transition('in=>out', animate('500ms')),
            transition('out=>in', animate('500ms')),
        ]),
    ],
})
export class MainMenuComponent implements OnInit {
    state: string = 'in';

    constructor() {}

    ngOnInit(): void {}

    createNewDrawing(): void {
        console.log('Create new drawing');
        this.fadeOut();
    }

    fadeOut(): void {
        this.state = 'out';
    }

    fadeIn(): void {
        this.state = 'in';
    }
}
