import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDrawingService } from '@app/services/popups/new-drawing';
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
        component.hidePopup();
        expect(newDrawingService.showPopup).toBe(false);
    });

    it('Should create a new Drawing', () => {
        const funcSpy = spyOn(newDrawingService, 'newCanvas');
        component.createNewDrawing(false);
        expect(funcSpy).toHaveBeenCalled();
    });

    it('Should not show popup if emtpy', () => {
        spyOn(newDrawingService, 'newCanvas').and.stub();
        spyOn(component, 'hidePopup').and.stub();
        component.createNewDrawing(true);
        expect(component.hidePopup).toHaveBeenCalled();
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

    it('should stop block shortcuts if the warning is displayed', () => {
        shortcutHandler.blockShortcuts = false;
        newDrawingService.showPopup = false;
        spyOn(newDrawingService, 'newCanvas').and.callFake(() => {
            newDrawingService.showPopup = true;
        });
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        component.onKeyDown(keyEvent);
        expect(shortcutHandler.blockShortcuts).toBeTruthy();
    });

    it('should do nothing if the shortcuts are blocked', () => {
        shortcutHandler.blockShortcuts = true;
        spyOn(newDrawingService, 'newCanvas');
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        component.onKeyDown(keyEvent);
        expect(newDrawingService.newCanvas).not.toHaveBeenCalled();
    });
});
