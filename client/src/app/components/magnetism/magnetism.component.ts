import { Component } from '@angular/core';
import { MagnetismSelection, MagnetismService } from '@app/services/drawing/magnetism.service';

@Component({
    selector: 'app-magnetism',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent {
    magnetismSelection: typeof MagnetismSelection;

    constructor(public magnetismService: MagnetismService) {
        this.magnetismSelection = MagnetismSelection;
    }

    isSelected(position: MagnetismSelection): { [key: string]: string } {
        return this.magnetismService.selection === position ? { 'background-color': '#ec5681' } : { 'background-color': 'white' };
    }

    setSelected(position: MagnetismSelection): void {
        this.magnetismService.selection = position;
    }
}
