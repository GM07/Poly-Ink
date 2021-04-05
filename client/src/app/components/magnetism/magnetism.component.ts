import { Component, ElementRef, ViewChild } from '@angular/core';
import { MagnetismSelection, MagnetismService } from '@app/services/drawing/magnetism.service';

@Component({
    selector: 'app-magnetism',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent {
    magnetismSelection: typeof MagnetismSelection;

    @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLDivElement>;
    @ViewChild('top', { static: false }) top: ElementRef<HTMLDivElement>;
    @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLDivElement>;
    @ViewChild('left', { static: false }) left: ElementRef<HTMLDivElement>;
    @ViewChild('center', { static: false }) center: ElementRef<HTMLDivElement>;
    @ViewChild('right', { static: false }) right: ElementRef<HTMLDivElement>;
    @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLDivElement>;
    @ViewChild('bottom', { static: false }) bottom: ElementRef<HTMLDivElement>;
    @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLDivElement>;

    constructor(public magnetismService: MagnetismService) {
        this.magnetismSelection = MagnetismSelection;
    }

    setSelected(position: MagnetismSelection): void {
        this.magnetismService.selection = position;
        this.topLeft.nativeElement.style.background = position === MagnetismSelection.TopLeft ? 'gray' : 'white';
        this.top.nativeElement.style.background = position === MagnetismSelection.Top ? 'gray' : 'white';
        this.topRight.nativeElement.style.background = position === MagnetismSelection.TopRight ? 'gray' : 'white';
        this.left.nativeElement.style.background = position === MagnetismSelection.Left ? 'gray' : 'white';
        this.center.nativeElement.style.background = position === MagnetismSelection.Center ? 'gray' : 'white';
        this.right.nativeElement.style.background = position === MagnetismSelection.Right ? 'gray' : 'white';
        this.bottomLeft.nativeElement.style.background = position === MagnetismSelection.BottomLeft ? 'gray' : 'white';
        this.bottom.nativeElement.style.background = position === MagnetismSelection.Bottom ? 'gray' : 'white';
        this.bottomRight.nativeElement.style.background = position === MagnetismSelection.BottomRight ? 'gray' : 'white';
    }
}
