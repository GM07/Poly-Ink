import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-junction-type',
  templateUrl: './junction-type.component.html',
  styleUrls: ['./junction-type.component.scss']
})
export class JunctionTypeComponent implements OnInit {

  avecPoint: boolean = false;

  constructor() { }

  toggleTypeLigne(typeLigne: string): void {
    typeLigne === 'normal' ? (this.avecPoint = false) : (this.avecPoint = true);
  }

  ngOnInit(): void {
  }

}
