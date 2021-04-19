import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingConstants } from '@app/constants/drawing';
import { ServerCommunicationService } from '@app/services/server-communication/server-communication.service';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';

@Component({
    selector: 'app-drawing-tags',
    templateUrl: './drawing-tags.component.html',
    styleUrls: ['./drawing-tags.component.scss'],
})
export class DrawingTagsComponent implements OnInit {
    readonly SEPARATOR_KEYS_CODES: number[] = [ENTER, COMMA];

    visible: boolean;
    selectable: boolean;
    removable: boolean;
    addOnBlur: boolean;
    drawings: Drawing[];
    filterTags: Tag[];
    @Output() filteredDrawings: EventEmitter<Drawing[]>;
    @Output() serverError: EventEmitter<boolean>;
    @Output() isFocused: EventEmitter<boolean>;

    constructor(private serverCommunicationService: ServerCommunicationService) {
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.drawings = [];
        this.filterTags = [];
        this.filteredDrawings = new EventEmitter<Drawing[]>();
        this.serverError = new EventEmitter<boolean>();
        this.isFocused = new EventEmitter<boolean>();
    }
    ngOnInit(): void {
        this.getAllDrawings();
    }

    getAllDrawings(): void {
        this.serverCommunicationService.getAllDrawings().subscribe((drawings: Drawing[]) => {
            this.drawings = drawings;
        });
    }

    getFilteredDrawings(): void {
        this.drawings = [];
        this.serverCommunicationService.getFilteredDrawings(this.filterTags).subscribe(
            (drawings: Drawing[]) => {
                this.drawings = drawings;
                this.serverError.emit(false);
                this.filteredDrawings.emit(this.drawings);
            },
            () => {
                this.serverError.emit(true);
                this.filteredDrawings.emit(this.drawings);
            },
        );
    }

    addFilter(event: MatChipInputEvent): void {
        const value = event.value;
        const regex = new RegExp('^[a-zA-Z-0-9]+$');
        if (regex.test(value) && value.trim() && this.filterTags.length < DrawingConstants.MAX_TAGS) {
            this.filterTags.push({ name: value });
            this.getFilteredDrawings();
        }
        event.input.value = '';
    }

    remove(tag: Tag): void {
        const tagIndex = this.filterTags.indexOf(tag);
        if (tagIndex >= 0) {
            this.filterTags.splice(tagIndex, 1);
            this.getFilteredDrawings();
        }
    }
}
