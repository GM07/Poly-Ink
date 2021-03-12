import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CarrouselComponent, DrawingContent } from '@app/components/carrousel/carrousel.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { of } from 'rxjs';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;
    let canvasRef: ElementRef<HTMLCanvasElement>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarrouselComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                    { path: 'carrousel', component: EditorComponent },
                ]),
                NoopAnimationsModule,
                MatIconModule,
                MatChipsModule,
                MatProgressSpinnerModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;

        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;
        component.drawingsList = [{ canvas, name: '', tags: [] }];
        canvasRef = new ElementRef<HTMLCanvasElement>(canvas);
        component.middlePreview = canvasRef;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe to the activated route', () => {
        const activatedRoute = new ActivatedRoute();
        const urlSegments: UrlSegment[] = [];
        urlSegments.push(new UrlSegment(component['CARROUSEL_URL'], {}));
        activatedRoute.url = of(urlSegments);
        component['subscribeActivatedRoute'](activatedRoute);
        expect(component.showCarrousel).toBeTruthy();
    });

    it('should go back to the reset state when the translation is done', () => {
        spyOn<any>(component, 'updateCanvasPreview');
        component.translationState = 'left';
        component.translationDone();
        expect(component.translationState).toEqual('reset');
    });

    it('should indicate when the translation is done after the reset has been completed', () => {
        const update = spyOn<any>(component, 'updateCanvasPreview');
        component.translationState = 'reset';
        component.translationDone();
        expect(update).not.toHaveBeenCalled();
    });

    it('should not update when there is nothing to be displayed', () => {
        const update = spyOn<any>(component, 'updateSingleDrawingContent');
        component.drawingsList = [];
        component['updateCanvasPreview']();
        expect(update).not.toHaveBeenCalled();
    });

    it('should update every drawing to be displayed', () => {
        const update = spyOn<any>(component, 'updateSingleDrawingContent');
        const numberOfTimeCalled = 5;
        component['updateCanvasPreview']();
        expect(update).toHaveBeenCalledTimes(numberOfTimeCalled);
    });

    it('should update a single displayed drawing', () => {
        const drawImage = spyOn(canvasRef.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'drawImage');
        let drawingContent = {} as DrawingContent;
        component.drawingsList = [{ canvas: canvasRef.nativeElement, name: 'a', tags: ['a'] } as DrawingContent];
        component['updateSingleDrawingContent'](canvasRef, 0, drawingContent);
        expect(drawingContent.canvas).toEqual(canvasRef.nativeElement);
        expect(drawingContent.name).toEqual('a');
        expect(drawingContent.tags).toEqual(['a']);
        expect(drawImage).toHaveBeenCalled();
        drawImage.calls.reset();

        drawingContent = {} as DrawingContent;
        canvasRef.nativeElement.width = 2;
        component.drawingsList = [{ canvas: canvasRef.nativeElement, name: 'b', tags: ['b'] } as DrawingContent];
        component['updateSingleDrawingContent'](canvasRef, 0, drawingContent);
        expect(drawingContent.canvas).toEqual(canvasRef.nativeElement);
        expect(drawingContent.name).toEqual('b');
        expect(drawingContent.tags).toEqual(['b']);
        expect(drawImage).toHaveBeenCalled();
    });

    it('should allow to take the element on the left of the carrousel', () => {
        component['animationIsDone'] = true;
        component.translationState = 'reset';
        component.clickLeft();
        expect(component.translationState).toEqual('right');
    });

    it('should allow to take the element on the right of the carrousel', () => {
        component['animationIsDone'] = true;
        component.translationState = 'reset';
        component.clickRight();
        expect(component.translationState).toEqual('left');
    });

    it('should close the carrousel', () => {
        const navigate = spyOn(component['router'], 'navigateByUrl');
        component.showCarrousel = true;
        component.currentURL = component['CARROUSEL_URL'];
        component.closeCarrousel();
        expect(component.showCarrousel).toBeFalsy();
        expect(navigate).toHaveBeenCalledWith('home');
    });

    it('should show a loading error', () => {
        const update = spyOn<any>(component, 'updateCanvasPreview');
        component['animationIsDone'] = true;
        component.drawingsList[0].canvas = (undefined as unknown) as HTMLCanvasElement;
        component.loadDrawing(0);
        expect(update).toHaveBeenCalled();
        expect(component.showLoadingError).toBeTruthy();
    });

    it('should show a warning when loading', () => {
        const update = spyOn<any>(component, 'updateCanvasPreview');
        component['drawingService'].canvas = canvasRef.nativeElement;
        spyOn(component.newDrawing, 'isNotEmpty').and.returnValue(true);
        component.currentURL = '';
        component['animationIsDone'] = true;
        component.loadDrawing(0);
        expect(update).toHaveBeenCalled();
        expect(component.newDrawing.showWarning).toBeTruthy();
    });

    it('should close the carrousel and navigate by url when succesfully loading a drawing', () => {
        const navigationSpy = spyOn<any>(component['router'], 'navigateByUrl');
        const update = spyOn<any>(component, 'updateCanvasPreview');
        const closeCarrousel = spyOn<any>(component, 'closeCarrousel');
        component.currentURL = component['CARROUSEL_URL'];
        component['animationIsDone'] = true;
        component.loadDrawing(0);
        expect(update).toHaveBeenCalled();
        expect(closeCarrousel).toHaveBeenCalled();
        expect(navigationSpy).toHaveBeenCalled();
    });

    it('should close the carrousel load the drawing when succesfully loading a drawing', () => {
        const loadrDrawingSpy = spyOn<any>(component['drawingService'], 'loadDrawing');
        const update = spyOn<any>(component, 'updateCanvasPreview');
        const closeCarrousel = spyOn<any>(component, 'closeCarrousel');
        component.currentURL = '';
        component['animationIsDone'] = true;
        component.newDrawing.showWarning = true;
        component.loadDrawing(0);
        expect(update).toHaveBeenCalled();
        expect(closeCarrousel).toHaveBeenCalled();
        expect(loadrDrawingSpy).toHaveBeenCalled();
    });

    it('should delete a drawing', () => {
        component.deleteDrawing();
    });

    it('should detect the shortcut to display the carrousel', () => {
        component.showCarrousel = false;
        component['shortcutHandler'].blockShortcuts = false;
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'g' });
        component.onKeyDown(keyEvent);
        expect(component.showCarrousel).toBeTruthy();
    });

    it('should detect the left arrow key', () => {
        spyOn(component, 'clickLeft');
        component.newDrawing.showWarning = false;
        component.showCarrousel = true;
        const keyBoardEvent = { key: 'arrowleft', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        component.onKeyDown(keyBoardEvent);
        expect(component.clickLeft).toHaveBeenCalled();
    });

    it('should detect the right arrow key', () => {
        spyOn(component, 'clickRight');
        component.newDrawing.showWarning = false;
        component.showCarrousel = true;
        const keyBoardEvent = { key: 'arrowright', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        component.onKeyDown(keyBoardEvent);
        expect(component.clickRight).toHaveBeenCalled();
    });
});
