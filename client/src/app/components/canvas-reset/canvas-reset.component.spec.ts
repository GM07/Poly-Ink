import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { NewDrawingComponent } from './canvas-reset.component';

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let popupHandlerService: PopupHandlerService;
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
        popupHandlerService = TestBed.inject(PopupHandlerService);
        shortcutHandler = TestBed.inject(ShortcutHandlerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set showWarning to false', () => {
        component.hidePopup();
        expect(popupHandlerService.newDrawing.showPopup).toBe(false);
    });

    it('Should create a new Drawing', () => {
        const funcSpy = spyOn(popupHandlerService.newDrawing, 'newCanvas');
        component.createNewDrawing(false);
        expect(funcSpy).toHaveBeenCalled();
    });

    it('Should create a new drawing with ctrl+o', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        const keySpy = spyOn(popupHandlerService.newDrawing, 'newCanvas');
        component.onKeyDown(keyEvent);
        expect(keySpy).toHaveBeenCalled();
    });

    it('should not create a new drawing if not ctrl', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: false, key: 'o' });
        const keySpy = spyOn(popupHandlerService.newDrawing, 'newCanvas');
        component.onKeyDown(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });

    it('should not create a new drawing with other key', () => {
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'b' });
        const keySpy = spyOn(popupHandlerService.newDrawing, 'newCanvas');
        component.onKeyDown(keyEvent);
        expect(keySpy).not.toHaveBeenCalled();
    });

    it('should stop propagations if the warning is displayed', () => {
        spyOn(popupHandlerService.newDrawing, 'newCanvas');
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'o' });
        component.onKeyDown(keyEvent);
        expect(shortcutHandler.blockShortcuts).toBeTruthy();
    });
});
