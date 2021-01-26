import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
    let component: MainMenuComponent;
    let fixture: ComponentFixture<MainMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [MainMenuComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    //
    it('should fade out', () => {
        component.fadeOut();
        expect(component.state).toBe('invisible');
    });

    it('should fade in', () => {
        component.fadeIn();
        expect(component.state).toBe('visible');
    });

    it('should be visible after fade in', () => {
        component.fadeIn();
        component.endOfFadeAnimation();
        expect(component.showComponent).toBe(true);
    });

    it('should be invisible after fade out', () => {
        component.fadeOut();
        component.endOfFadeAnimation();
        expect(component.showComponent).toBe(false);
    });

    it('can continue to draw', () => {
        // For now, we can't continue to draw, because the feature hasn't been implemented yet
        expect(component.continuingDrawing()).toBe(false);
    });

    it('should create new drawing', () => {
        component.createNewDrawing();
        expect(component.state).toBe('invisible');
    });
});
