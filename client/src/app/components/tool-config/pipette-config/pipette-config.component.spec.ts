import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PipetteConfigComponent } from './pipette-config.component';

describe('PipetteConfigComponent', () => {
    let component: PipetteConfigComponent;
    let fixture: ComponentFixture<PipetteConfigComponent>;
    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PipetteConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(PipetteConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
