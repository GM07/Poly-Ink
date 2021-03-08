import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/communication/drawing';

interface Tag {
  name: string;
}

@Component({
  selector: 'app-drawing-tags',
  templateUrl: './drawing-tags.component.html',
  styleUrls: ['./drawing-tags.component.scss']
})
export class DrawingTagsComponent implements OnInit {

  constructor(private carrouselService: CarrouselService) { }

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
        console.log(this.drawings);
      });
  }

  addFilter(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.filterTags.push({name: value.trim()});
      this.getFilteredDrawings();
    }

    // Reset the input value
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
