import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';

@Component({
    selector: 'app-drawing-tags',
    templateUrl: './drawing-tags.component.html',
    styleUrls: ['./drawing-tags.component.scss'],
})
export class DrawingTagsComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    visible: boolean;
    selectable: boolean;
    removable: boolean;
    addOnBlur: boolean;
    drawings: Drawing[];
    filterTags: Tag[];
    noMatchingTags: boolean;
    @Output() filteredDrawings: EventEmitter<Drawing[]>;
    @Output() serverError: EventEmitter<boolean>;

    constructor(private carrouselService: CarrouselService) {
        this.noMatchingTags = false;
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.drawings = [];
        this.filterTags = [];
        this.filteredDrawings = new EventEmitter<Drawing[]>();
        this.serverError = new EventEmitter<boolean>();
    }
    ngOnInit(): void {
        this.getAllDrawings();
    }

    getAllDrawings(): void {
        this.carrouselService.getAllDrawings().subscribe((drawings: Drawing[]) => {
            this.drawings = drawings;
        });
    }

    getFilteredDrawings(): void {
        this.drawings = [];
        this.carrouselService.getFilteredDrawings(this.filterTags).subscribe(
            (drawings: Drawing[]) => {
                this.drawings = drawings;
                drawings.length ? (this.noMatchingTags = false) : (this.noMatchingTags = true);
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

        if (value.trim()) {
            this.filterTags.push({ name: value.trim() });
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
