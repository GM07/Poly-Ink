import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { ColorConfigComponent } from './color-config.component';

@Component({ selector: 'app-color-icon', template: '' })
class StubColorIconComponent {}

describe('ColorConfigComponent', () => {
    let component: ColorConfigComponent;
    let fixture: ComponentFixture<ColorConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorConfigComponent, StubColorIconComponent],
            imports: [MatDividerModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
