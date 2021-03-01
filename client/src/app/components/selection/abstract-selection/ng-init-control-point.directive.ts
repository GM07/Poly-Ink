import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[appNgInitControlPoint]',
})
export class NgInitControlPointDirective implements OnInit {
    private readonly TIMEOUT_TIME: number = 10;

    @Output() ngInit: EventEmitter<void> = new EventEmitter();

    ngOnInit(): void {
        setTimeout(() => {
            this.ngInit.emit();
        }, this.TIMEOUT_TIME);
    }
}
