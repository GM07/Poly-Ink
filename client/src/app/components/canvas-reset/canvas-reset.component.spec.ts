import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawingComponent } from './canvas-reset.component';

import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let newDrawingService: NewDrawingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        newDrawingService = TestBed.inject(NewDrawingService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set showWarning to false', () => {
        component.fadeOut();
        expect(newDrawingService.showWarning).toBe(false);
    });

    it('Should create a new Drawing', () => {
        const funcSpy = spyOn(newDrawingService, 'newCanvas');
        component.createNewDrawing(false);
        expect(funcSpy).toHaveBeenCalled();
    });

    it('Should create a new drawing with ctrl+o', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        const keySpy = spyOn(newDrawingService, 'newCanvas');
        component.onKeyPressed(keyEvent);
        expect(keySpy).toHaveBeenCalled();
    });

    it('should not create a new drawing if not ctrl', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: false, key: 'o' });
        const keySpy = spyOn(newDrawingService, 'newCanvas');
        component.onKeyPressed(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });

    it('should not create a new drawing with other key', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'b' });
        const keySpy = spyOn(newDrawingService, 'newCanvas');
        component.onKeyPressed(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });
});
