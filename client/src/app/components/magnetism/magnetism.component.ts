import { Component, ElementRef, ViewChild } from '@angular/core';
import { MagnetismSelection, MagnetismService } from '@app/services/drawing/magnetism.service';

@Component({
    selector: 'app-magnetism',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent {
    magnetismSelection: typeof MagnetismSelection;

    @ViewChild('topLeft', { static: false }) private topLeft: ElementRef<HTMLDivElement>;
    @ViewChild('top', { static: false }) private top: ElementRef<HTMLDivElement>;
    @ViewChild('topRight', { static: false }) private topRight: ElementRef<HTMLDivElement>;
    @ViewChild('left', { static: false }) private left: ElementRef<HTMLDivElement>;
    @ViewChild('center', { static: false }) private center: ElementRef<HTMLDivElement>;
    @ViewChild('right', { static: false }) private right: ElementRef<HTMLDivElement>;
    @ViewChild('bottomLeft', { static: false }) private bottomLeft: ElementRef<HTMLDivElement>;
    @ViewChild('bottom', { static: false }) private bottom: ElementRef<HTMLDivElement>;
    @ViewChild('bottomRight', { static: false }) private bottomRight: ElementRef<HTMLDivElement>;

    constructor(public magnetismService: MagnetismService) {
        this.magnetismSelection = MagnetismSelection;
    }

    setSelected(position: MagnetismSelection): void {
        this.magnetismService.selection = position;
        this.topLeft.nativeElement.style.background = position === MagnetismSelection.TopLeft ? '#ec5681' : 'white';
        this.top.nativeElement.style.background = position === MagnetismSelection.Top ? '#ec5681' : 'white';
        this.topRight.nativeElement.style.background = position === MagnetismSelection.TopRight ? '#ec5681' : 'white';
        this.left.nativeElement.style.background = position === MagnetismSelection.Left ? '#ec5681' : 'white';
        this.center.nativeElement.style.background = position === MagnetismSelection.Center ? '#ec5681' : 'white';
        this.right.nativeElement.style.background = position === MagnetismSelection.Right ? '#ec5681' : 'white';
        this.bottomLeft.nativeElement.style.background = position === MagnetismSelection.BottomLeft ? '#ec5681' : 'white';
        this.bottom.nativeElement.style.background = position === MagnetismSelection.Bottom ? '#ec5681' : 'white';
        this.bottomRight.nativeElement.style.background = position === MagnetismSelection.BottomRight ? '#ec5681' : 'white';
    }
}
