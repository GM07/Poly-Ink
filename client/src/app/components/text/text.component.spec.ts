import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/constants/control';
import { TextService } from '@app/services/tools/text.service';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
    let component: TextComponent;
    let fixture: ComponentFixture<TextComponent>;
    let textService: TextService;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        textService = TestBed.inject(TextService);
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
        spyOn(component, 'addText');
        textService.config.hasInput = false;
        colorService.isMenuOpen = false;
        component.onMouseDown(mouseEvent);
        expect(component.addText).toHaveBeenCalledTimes(0);

        mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        component.onMouseDown(mouseEvent);
        expect(component.addText).toHaveBeenCalledTimes(1);
    });

    it('should call confirmText when mouseDown and there is input', () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        spyOn(textService, 'isInCanvas').and.returnValue(true);
        spyOn(component, 'confirmText');
        colorService.isMenuOpen = false;
        textService.config.hasInput = true;
        component.onMouseDown(mouseEvent);
        expect(component.confirmText).toHaveBeenCalled();
    });

    it('should call confirmText from textService', () => {
        spyOn(textService, 'confirmText');
        component.confirmText();
        expect(textService.confirmText).toHaveBeenCalled();
    });

    it('should add text and modify config attributes accordingly', () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        spyOn(textService, 'drawPreview');
        component.addText(mouseEvent);
        expect(textService.config.hasInput).toBe(true);
        expect(textService.config.startCoords.x).toBe(mouseEvent.offsetX);
        expect(textService.config.startCoords.y).toBe(mouseEvent.offsetY);
        expect(textService.drawPreview).toHaveBeenCalled();
    });
});
