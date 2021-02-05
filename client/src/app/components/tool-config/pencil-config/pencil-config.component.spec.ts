//import { DebugElement } from '@angular/core';
//import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PencilService } from '@app/services/tools/pencil-service';
//import {HarnessLoader} from '@angular/cdk/testing';
//import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
//import { MatButtonHarness } from '@angular/material/button/testing';

import { PencilConfigComponent } from './pencil-config.component';

//let loader: HarnessLoader;

describe('PencilConfigComponent', () => {
    let component: PencilConfigComponent;
    let fixture: ComponentFixture<PencilConfigComponent>;
    let pencilService: PencilService;

    /*beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule, MatInputModule]
        }).compileComponents();
        fixture = TestBed.createComponent(PencilConfigComponent);
    }));*/

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PencilConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule, MatInputModule]
        }).compileComponents();
        fixture = TestBed.createComponent(PencilConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        pencilService = TestBed.inject(PencilService); 
        //loader = TestbedHarnessEnvironment.loader(fixture);
    });

    /*
    //Testing the harness
    it('should work', async() => {
        const buttons = await loader.getAllHarnesses(MatButtonHarness);
        const firstButton = await loader.getHarness(MatButtonHarness);
    });*/

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the same value of lineWidth than pencilService.lineWidth', () => {
        spyOnProperty(pencilService, 'lineWidth', 'get');
        expect(pencilService.lineWidth).toBe(component.lineWidth);
    });

    it('can spy on setter', () => {
        const spy = spyOnProperty(pencilService, 'lineWidth', 'set');
        pencilService.lineWidth = 13;
        expect(spy).toHaveBeenCalled();
    });

    /*
    it('should change lineWidth in pencilService when slider changes', () => {
        const spy = spyOnProperty(pencilService, 'lineWidth', 'set');
        const dElement: DebugElement = fixture.debugElement;
        const sElement: HTMLElement = dElement.nativeElement;

        const slider = sElement.querySelector('mat-slider');
        
        //slider?.dispatchEvent(new MouseEvent('mouseDown'));
        //slider?.dispatchEvent(new MouseEvent('mouseMove'));
        slider?.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
    });*/

/*
    it('should call lineWidth setter when matslider value changes', () => {
        const sliderDE: DebugElement = fixture.debugElement;
        const sliderEL: HTMLElement = sliderDE.nativeElement;
        const slider = sliderEL.querySelector('mat-slider#widthSlider');

        slider?.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        expect(pencilService.lineWidth()).toHaveBeenCalled();
    });*/

});
