import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';

@Component({
  selector: 'app-drawing-tags',
  templateUrl: './drawing-tags.component.html',
  styleUrls: ['./drawing-tags.component.scss']
})
export class DrawingTagsComponent implements OnInit {

  constructor(private carrouselService: CarrouselService) {
    this.noMatchingTags = false;
  }

  ngOnInit(): void {
    this.getAllDrawings();
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  drawings: Drawing[] = [];
  filterTags: Tag[] = [];
  noMatchingTags: boolean;

  @Output() filteredDrawings = new EventEmitter<Drawing[]>();

  getAllDrawings(): void {
    this.carrouselService.getAllDrawings()
      .subscribe((drawings: Drawing[]) => {
        this.drawings = drawings;
        console.log(this.drawings);
      });
  }
  
  getFilteredDrawings(): void {
    this.drawings  = [];
    this.carrouselService.getFilteredDrawings(this.filterTags)
      .subscribe((drawings: Drawing[]) => {
        this.drawings = drawings;
        drawings.length ? this.noMatchingTags = false : this.noMatchingTags = true;
        this.filteredDrawings.emit(this.drawings);
      });
  }

  addFilter(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.filterTags.push({name: value.trim()});
      this.getFilteredDrawings();
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const tagIndex = this.filterTags.indexOf(tag);
    if (tagIndex >= 0) {
      this.filterTags.splice(tagIndex, 1);
      this.getFilteredDrawings();
    }
  }
}
