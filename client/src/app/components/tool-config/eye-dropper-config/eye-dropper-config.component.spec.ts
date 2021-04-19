import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';
import { EyeDropperConfigComponent } from './eye-dropper-config.component';

describe('EyeDropperConfigComponent', () => {
    // tslint:disable:no-string-literal
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
        component['eyeDropperService'] = TestBed.inject(EyeDropperService);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // tslint:disable:no-any
    it('should draw on the canvas when the previsualisation sends an update notification', () => {
        component.hexColor = 'FFFFFF';
        fixture.detectChanges();
        const getContextSpy = spyOn<any>(component['previewEyeDropper'].nativeElement, 'getContext').and.callThrough();
        component['eyeDropperService'].updatePrevisualisation.next('ABABAB');
        expect(getContextSpy).toHaveBeenCalled();
    });

    it('should do nothing if outside of the canvas', () => {
        component.hexColor = 'FFFFFF';
        fixture.detectChanges();
        const getContextSpy = spyOn<any>(component['previewEyeDropper'].nativeElement, 'getContext').and.callThrough();
        component['eyeDropperService'].updatePrevisualisation.next('');
        expect(getContextSpy).not.toHaveBeenCalled();
    });

    it('draw circle around preview should draw a circle around the preview', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctx, 'ellipse');
        component['drawCircleAroundPreview'](ctx, 2);
        expect(ctx.ellipse).toHaveBeenCalled();
    });
});
