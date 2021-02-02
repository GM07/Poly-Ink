import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToolConfigComponent } from './tool-config.component';

/*
@Component({
    selector: 'app-crayon-config',
    template: '<p>Mock Crayon Config Component</p>'
})
class MockCrayonConfigComponent {}*/

describe('ToolConfigComponent', () => {
    let component: ToolConfigComponent;
    let fixture: ComponentFixture<ToolConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolConfigComponent], // , MockCrayonConfigComponent
            imports: [MatDialogModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
