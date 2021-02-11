import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from 'src/color-picker/services/color.service';
import { ColorPreviewComponent } from './color-preview.component';

describe('ColorPreviewComponent', () => {
    let component: ColorPreviewComponent;
    let fixture: ComponentFixture<ColorPreviewComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({});
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ColorPreviewComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorPreviewComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
});
