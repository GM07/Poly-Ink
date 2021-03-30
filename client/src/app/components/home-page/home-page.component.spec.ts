import { HttpClientModule } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let drawingService: DrawingService;
    let zone: NgZone;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent, EditorComponent, CarrouselComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                    { path: 'carrousel', component: CarrouselComponent },
                ]),
                HttpClientModule,
                NoopAnimationsModule,
                MatButtonModule,
                MatExpansionModule,
                MatIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
        zone = TestBed.inject(NgZone);
        drawingService = TestBed.inject(DrawingService);
        zone.run(() => {
            router.initialNavigation();
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

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

    it('should create new drawing', () => {
        component.createNewDrawing();
        expect(component.state).toBe('invisible');
    });

    it('should open the carrousel', () => {
        component.openCarrousel();
        expect(component.state).toBe('invisible');
    });

    it('should go back to menu', () => {
        component.createNewDrawing();
        expect(component.state).toBe('invisible');
        component.backToMenu();
        expect(component.state).toBe('visible');
    });

    it('should call fadeOut and createLoadedCanvasFromStorage when continue drawing button is clicked', () => {
        spyOn(component, 'fadeOut');
        spyOn(drawingService, 'createLoadedCanvasFromStorage');
        component.continueDrawing();
        expect(component.fadeOut).toHaveBeenCalled();
        expect(drawingService.createLoadedCanvasFromStorage).toHaveBeenCalled();
    });

    it('should show continue drawing button when drawingService provided a non null drawing from local storage', () => {
        drawingService.getSavedDrawing = jasmine.createSpy().and.returnValue('test_drawing');
        component.init();
        expect(component.showContinueDrawing).toBeTruthy();
    });
});
