import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/constants/control';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { TextService } from '@app/services/tools/text.service';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { TextComponent } from './text.component';

// To access private methods with any and with string literals
// tslint:disable:no-any
// tslint:disable:no-string-literal

describe('TextComponent', () => {
    let component: TextComponent;
    let fixture: ComponentFixture<TextComponent>;
    let textService: TextService;
    let colorService: ColorService;
    let shortcutHandlerService: ShortcutHandlerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        textService = TestBed.inject(TextService);
        shortcutHandlerService = TestBed.inject(ShortcutHandlerService);
        colorService = colorService = {
            primaryColor: Colors.BLACK,
            secondaryColor: Colors.BLUE,
            primaryColorAlpha: 1.0,
            secondaryColorAlpha: 1.0,
        } as ColorService;
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call addText when mouseDown and there is no input', () => {
        let mouseEvent = { button: MouseButton.Right, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        spyOn(textService, 'isInCanvas').and.returnValue(true);
        spyOn<any>(component, 'addText');
        textService.config.hasInput = false;
        colorService.isMenuOpen = false;
        component.onMouseDown(mouseEvent);
        expect(component['addText']).toHaveBeenCalledTimes(0);
        mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        component.onMouseDown(mouseEvent);
        expect(component['addText']).toHaveBeenCalledTimes(1);
    });

    it('should call confirmText when mouseDown and there is input', () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        spyOn(textService, 'isInCanvas').and.returnValue(true);
        spyOn<any>(component, 'confirmText');
        colorService.isMenuOpen = false;
        textService.config.hasInput = true;
        component.onMouseDown(mouseEvent);
        expect(component['confirmText']).toHaveBeenCalled();
    });

    it('should do nothing on mouse down', () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        component.shortcutHandlerService.blockShortcuts = true;
        textService.config.hasInput = false;
        spyOn<any>(component, 'confirmText');

        component.onMouseDown(mouseEvent);
        expect(component['confirmText']).toHaveBeenCalledTimes(0);
    });

    it('should call confirmText from textService', () => {
        spyOn(textService, 'confirmText');
        component['confirmText']();
        expect(textService.confirmText).toHaveBeenCalled();
    });

    it('should add text and modify config attributes accordingly', () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        spyOn(textService, 'drawPreview');
        component['addText'](mouseEvent);
        expect(textService.config.hasInput).toBe(true);
        expect(textService.config.startCoords.x).toBe(mouseEvent.offsetX);
        expect(textService.config.startCoords.y).toBe(mouseEvent.offsetY);
        expect(textService.drawPreview).toHaveBeenCalled();
    });

    it('should initialise subscriptions', () => {
        const drawingServiceSubscribe = spyOn(component.drawingService.changes, 'subscribe').and.callThrough();
        spyOn(textService, 'drawPreview');
        component['initSubscriptions']();
        expect(drawingServiceSubscribe).toHaveBeenCalled();
    });

    it('should call the appropriate subscribed methods', () => {
        const drawPreviewSpy = spyOn(textService, 'drawPreview');
        textService.config.hasInput = false;
        component.drawingService.changes.next();
        expect(drawPreviewSpy).toHaveBeenCalledTimes(0);

        textService.config.hasInput = true;
        component.drawingService.changes.next();
        expect(drawPreviewSpy).toHaveBeenCalledTimes(1);

        component.textService.escapeClicked.next();
        expect(shortcutHandlerService.blockShortcuts).toBe(false);
    });
});
