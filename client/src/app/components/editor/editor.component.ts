import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private router: Router) {
        //
    }

    backToMenu(): void {
        this.router.navigateByUrl('home');
    }
}
