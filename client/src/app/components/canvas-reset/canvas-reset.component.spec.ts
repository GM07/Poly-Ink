import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { NewDrawingComponent } from './canvas-reset.component';

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let newDrawingService: NewDrawingService;
    let shortcutHandler: ShortcutHandlerService;

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
        shortcutHandler = TestBed.inject(ShortcutHandlerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set showWarning to false', () => {
        component.removeWarning();
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
        component.onKeyDown(keyEvent);
        expect(keySpy).toHaveBeenCalled();
    });

    it('should not create a new drawing if not ctrl', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: false, key: 'o' });
        const keySpy = spyOn(newDrawingService, 'newCanvas');
        component.onKeyDown(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });

    it('should not create a new drawing with other key', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'b' });
        const keySpy = spyOn(newDrawingService, 'newCanvas');
        component.onKeyDown(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });

    it('should stop propagations if the warning is displayed', () => {
        spyOn(newDrawingService, 'newCanvas');
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        component.onKeyDown(keyEvent);
        expect(shortcutHandler.blockShortcuts).toBeTruthy();
    });
});
