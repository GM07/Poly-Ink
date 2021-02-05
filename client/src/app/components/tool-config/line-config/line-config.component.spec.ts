//import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
//import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//import { PencilService } from '@app/services/tools/pencil-service';
//import { MatSliderModule } from '@angular/material/slider';

import { LineConfigComponent } from './line-config.component';

describe('LineConfigComponent', () => {
    let component: LineConfigComponent;
    let fixture: ComponentFixture<LineConfigComponent>;
    //let service: PencilService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineConfigComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatInputModule, MatButtonModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call function toggleLineType() when button clicked', async(() => {
        spyOn(component, 'toggleLineType');

        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        fixture.whenStable().then(() => {
            expect(component.toggleLineType).toHaveBeenCalled();
        })
    }));

    /*
    it('should hide diameter junction point if withJunctionPoint is false', () => {
        // withJunctionPoint is declared as false 
        expect(fixture.debugElement.query(By.css('.textFormatForJunctionPoint'))).toBeNull();
    })

    it('should show diameter junction point if withJunctionPoint is true', () => {
        const button = fixture.debugElement.query(By.css('.textFormatButton')).nativeElement;
        button.click(); // withJunctionPoint becomes true
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.textFormatForJunctionPoint'))).();
    });*/
});
