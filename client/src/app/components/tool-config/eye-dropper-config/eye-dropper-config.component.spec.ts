import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';
import { EyeDropperConfigComponent } from './eye-dropper-config.component';

describe('PipetteConfigComponent', () => {
    let component: EyeDropperConfigComponent;
    let fixture: ComponentFixture<EyeDropperConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EyeDropperConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
            providers: [{ provide: EyeDropperService }],
        }).compileComponents();
        fixture = TestBed.createComponent(EyeDropperConfigComponent);
        component = fixture.componentInstance;
        component.eyeDropperService = TestBed.inject(EyeDropperService);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // tslint:disable:no-any
    it('it should draw on the canvas when the previsualisation sends an update notification', () => {
        const getContextSpy = spyOn<any>(component.previewEyeDropper.nativeElement, 'getContext').and.callThrough();
        component.eyeDropperService.updatePrevisualisation.next();
        expect(getContextSpy).toHaveBeenCalled();
    });
});
