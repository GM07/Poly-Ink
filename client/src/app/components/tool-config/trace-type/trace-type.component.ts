import { Component } from '@angular/core';

// TODO quand les formes seront faites!
/*export interface ITraceTypeComponent {
  traceType: string;
}*/

export abstract class AbstractTraceTypeComponent {
  traceType: string;
}

@Component({
    selector: 'app-trace-type',
    templateUrl: './trace-type.component.html',
    styleUrls: ['./trace-type.component.scss'],
})
export class TraceTypeComponent implements AbstractTraceTypeComponent {
  traceType: string;
}
