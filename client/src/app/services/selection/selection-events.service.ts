import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SelectionEventsService {
    onMouseLeaveEvent: Subject<void>;
    onMouseEnterEvent: Subject<void>;

    constructor() {
        this.onMouseLeaveEvent = new Subject();
        this.onMouseEnterEvent = new Subject();
    }
}
