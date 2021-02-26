import { Directive, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[appNgInitControlPoint]',
})
export class NgInitControlPointDirective {
    @Output('ngInit') initEvent: EventEmitter<void> = new EventEmitter();

    ngOnInit() {
        setTimeout(() => {
            this.initEvent.emit();
        }, 10);
    }
}
