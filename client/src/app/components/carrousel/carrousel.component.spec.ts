import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/popups/new-drawing';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { of, throwError } from 'rxjs';

const dummyDrawing: Drawing = {
    data: {
        tags: [{name: "tag3"}, {name: "tag5"}],
        name: "Test",
        _id: "1"
    },
    image: ""
}

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;
    let canvasDataURL: string;
    let imageRef: ElementRef<HTMLImageElement>;
    let createLoadedCanvasSpy: jasmine.Spy<any>;
    let getDrawingFromServerSpy: jasmine.Spy<any>;
    let carrouselService: CarrouselService;
    let drawServiceSpy: DrawingService;
    let shortcutServiceSpy: ShortcutHandlerService;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'loadDrawing']);
        shortcutServiceSpy = jasmine.createSpyObj('ShortcutHandlerService', ['onKeyDown']);
        //carrouselServiceSpy = jasmine.createSpyObj('CarrouselService', ['testConnection', 'getAllDrawings', 'getFilteredDrawings', 'deleteDrawing'])

        TestBed.configureTestingModule({
            declarations: [HomePageComponent, CarrouselComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'carrousel', component: CarrouselComponent },
                ]),
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatIconModule,
                MatChipsModule,
                MatProgressSpinnerModule,
            ],
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }, { provide: ShortcutHandlerService, useValue: shortcutServiceSpy }, CarrouselService, HttpTestingController]
        }).compileComponents();
    }));

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;

        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;
        component.drawingsList = [dummyDrawing];
        canvasDataURL = canvas.toDataURL();

        const image = new Image();
        image.src = canvasDataURL;
        imageRef = new ElementRef<HTMLImageElement>(image);
        component.middlePreview = imageRef;

        carrouselService = TestBed.inject(CarrouselService);

        getDrawingFromServerSpy = spyOn<any>(component, 'getDrawingFromServer').and.callFake((index: number) => {
            if (index === 0) return canvasDataURL;
            else return undefined;
        });

        createLoadedCanvasSpy = spyOn<any>(component, 'createLoadedCanvas');
        component['drawingService'].canvas = document.createElement('canvas');

        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('should initialise correctly', () => {
        const loadSpy = spyOn<any>(component, 'loadCarrousel');
        component.showCarrousel = false;
        component.ngOnInit();
        expect(loadSpy).not.toHaveBeenCalled();
        component.showCarrousel = true;
        component.isOnline = true;
        component.ngOnInit();
        expect(loadSpy).toHaveBeenCalled();
    });
    
    it('should subscribe to the activated route', () => {
        const activatedRoute = new ActivatedRoute();
        const urlSegments: UrlSegment[] = [];
        urlSegments.push(new UrlSegment(component['CARROUSEL_URL'], {}));
        activatedRoute.url = of(urlSegments);
        component['subscribeActivatedRoute'](activatedRoute);
        expect(component.showCarrousel).toBeTruthy();
    });
    
    it('should load the carrousel', async(() => {
        const drawings: Drawing[] = [];
        spyOn(carrouselService, 'getAllDrawings').and.returnValue(of(drawings));
        spyOn<any>(component, 'updateDrawingContent');
        const changeSpy = spyOn<any>(component['cd'], 'detectChanges');
        component['loadCarrousel']();
        fixture.detectChanges();
        expect(changeSpy).toHaveBeenCalledTimes(2);
        expect(component.drawingsList).toEqual(drawings);
    }));
    
    it('should go back to the reset state when the translation is done', () => {
        spyOn<any>(component, 'updateDrawingContent');
        component.translationState = 'left';
        component.translationDone();
        expect(component.translationState).toEqual('reset');
    });
    
    it('should indicate when the translation is done after the reset has been completed', () => {
        const update = spyOn<any>(component, 'updateDrawingContent');
        component.translationState = 'reset';
        component.translationDone();
        expect(update).not.toHaveBeenCalled();
    });
    
    it('should update every drawing to be displayed', () => {
        const update = spyOn<any>(component, 'updateSingleDrawingContent');
        const numberOfTimeCalled = 5;
        component['updateDrawingContent']();
        expect(update).toHaveBeenCalledTimes(numberOfTimeCalled);
    });
    
    it('should update a single displayed drawing', () => {
        let emptyDrawing: Drawing = {
            data: {
                tags: [],
                name: "",
                _id: ""
            },
            image: ""
        }

        const dummyDrawing2: Drawing = {
            data: {
                tags: [{name: "tag3"}, {name: "tag5"}],
                name: "Test",
                _id: "1"
            },
            image: ""
        }

        component.drawingsList = [];
        component['updateSingleDrawingContent'](imageRef, 1, emptyDrawing);
        expect(emptyDrawing.data._id).toEqual('');
        expect(emptyDrawing.data.name).toEqual('');
        expect(emptyDrawing.data.tags).toEqual([]);
        expect(imageRef.nativeElement.src).not.toEqual(canvasDataURL);
        
        component.drawingsList = [dummyDrawing2];
        component['updateSingleDrawingContent'](imageRef, 0, emptyDrawing);
        expect(emptyDrawing.data._id).toEqual('1');
        expect(emptyDrawing.data.name).toEqual('Test');
        expect(emptyDrawing.data.tags).toEqual([{name: "tag3"}, {name: "tag5"}]);
        //expect(imageRef.nativeElement.src).toEqual(canvasDataURL);
    });
    
    it('should allow to take the element on the left of the carrousel', () => {
        component.translationState = 'reset';
        component['animationIsDone'] = false;
        component.clickLeft();
        expect(component.translationState).not.toEqual('right');
        component['animationIsDone'] = true;
        component.clickLeft();
        expect(component.translationState).toEqual('right');
    });
    
    it('should allow to take the element on the right of the carrousel', () => {
        component.translationState = 'reset';
        component['animationIsDone'] = false;
        component.clickRight();
        expect(component.translationState).not.toEqual('left');
        component['animationIsDone'] = true;
        component.clickRight();
        expect(component.translationState).toEqual('left');
    });
    
    it('should close the carrousel', () => {
        const navigate = spyOn(component['router'], 'navigateByUrl');
        component.showCarrousel = true;
        component.closeCarrousel();
        expect(component.showCarrousel).toBeFalsy();
        expect(navigate).not.toHaveBeenCalledWith('home');
        component.currentURL = component['CARROUSEL_URL'];
        component.closeCarrousel();
        expect(navigate).toHaveBeenCalledWith('home');
    });
    
    it('should not load if there is nothing', () => {
        const update = spyOn<any>(component, 'updateDrawingContent');
        component['animationIsDone'] = true;
        component.drawingsList = [];
        component.loadDrawing(0);
        expect(update).not.toHaveBeenCalled();
    });
    
    it('should show a loading error', () => {
        const update = spyOn<any>(component, 'updateDrawingContent');
        component.drawingsList.push(new Drawing(new DrawingData('')));
        component['animationIsDone'] = true;
        component.drawingsList[0].data._id = '';
        component.loadDrawing(1);
        expect(update).toHaveBeenCalled();
        expect(component.showLoadingError).toBeTruthy();
    });
    
    it('should show a warning when loading', () => {
        spyOn<any>(component['router'], 'navigateByUrl');
        const update = spyOn<any>(component, 'updateDrawingContent');
        spyOn(NewDrawingService, 'isNotEmpty').and.returnValue(true);
        component.currentURL = '';
        component['animationIsDone'] = true;
        component.loadDrawing(0);
        expect(update).toHaveBeenCalled();
        expect(component.showLoadingWarning).toBeTruthy();
    });
    
    it('should display a loading screen when succesfully loading a drawing', () => {
        spyOn<any>(component, 'updateDrawingContent');
        spyOn(NewDrawingService, 'isNotEmpty').and.returnValue(false);
        component.currentURL = '';
        component['animationIsDone'] = true;
        component.loadDrawing(0);
        expect(component.isLoadingCarrousel).toBeTruthy();
        /*setTimeout((done) => {
            expect(createLoadedCanvasSpy).toHaveBeenCalled();
            done();
        }, 200);*/
    });

    it('should close the carrousel and navigate by url when succesfully loading a drawing', () => {
        const navigationSpy = spyOn<any>(component['router'], 'navigateByUrl');
        const closeCarrousel = spyOn<any>(component, 'closeCarrousel');
        component.currentURL = component['CARROUSEL_URL'];
        createLoadedCanvasSpy.and.callThrough();
        component['createLoadedCanvas'](imageRef.nativeElement);
        expect(closeCarrousel).toHaveBeenCalled();
        expect(navigationSpy).toHaveBeenCalled();
    });
    
    it('should close the carrousel and load the drawing when succesfully loading a drawing', () => {
        const closeCarrousel = spyOn<any>(component, 'closeCarrousel');
        component.currentURL = '';
        createLoadedCanvasSpy.and.callThrough();
        component['createLoadedCanvas'](imageRef.nativeElement);
        expect(closeCarrousel).toHaveBeenCalled();
        expect(drawServiceSpy.loadDrawing).toHaveBeenCalled();
    });
    
    it('should load filteredDrawings', () => {
        spyOn<any>(component, 'updateDrawingContent');
        let filteredDrawings: Drawing[] = [dummyDrawing];
        component.loadFilteredCarrousel(filteredDrawings);
        expect(component.drawingsList).toEqual(filteredDrawings);
    })

    it('should delete a drawing', async() => {
        let dummyDrawing1: Drawing = {
            data: {
                tags: [{name: "tag3"}, {name: "tag5"}],
                name: "Test",
                _id: "1"
            },
            image: ""
        }
        let dummyDrawing2: Drawing = {
            data: {
                tags: [{name: "tag3"}, {name: "tag5"}],
                name: "Test",
                _id: "1"
            },
            image: ""
        }
        component.currentIndex = 0;
        component.drawingsList = [dummyDrawing1, dummyDrawing2];
        const responseMock = of(true);
        spyOn(responseMock, 'subscribe').and.callThrough();
        spyOn(carrouselService, 'deleteDrawing').and.returnValue(responseMock);
        const spy = spyOn<any>(component, 'updateDrawingContent');
        component['animationIsDone'] = false;
        component.deleteDrawing();
        fixture.detectChanges();
        component['animationIsDone'] = true;
        component.deleteDrawing();
        expect(spy).toHaveBeenCalled();
        expect(component.drawingsList).toEqual([dummyDrawing2]);
    });
    
    it('should detect the shortcut to display the carrousel', () => {
        const loadSpy = spyOn<any>(component, 'loadCarrousel');
        component.showCarrousel = true;
        component.showLoadingWarning = true;
        component['shortcutHandler'].blockShortcuts = false;
        const keyEvent = new KeyboardEvent('document:keydown', { ctrlKey: true, key: 'g' });
        component.onKeyDown(keyEvent);
        expect(loadSpy).not.toHaveBeenCalled();
        component.showCarrousel = false;
        component.onKeyDown(keyEvent);
        expect(component.showCarrousel).toBeTruthy();
        expect(loadSpy).toHaveBeenCalled();
    });

    it('should throw error and load server error', async() => {
        spyOn(carrouselService, 'getAllDrawings').and.returnValue(throwError('allo'));
        component['loadCarrousel']();
        expect(component.serverConnexionError).toBeTrue();
    });
    
    it('should detect the left arrow key', () => {
        spyOn(component, 'clickLeft');
        component.showLoadingWarning = false;
        component.showCarrousel = true;
        let keyBoardEvent = { key: 'noArrow', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        component.onKeyDown(keyBoardEvent);
        expect(component.clickLeft).not.toHaveBeenCalled();
        keyBoardEvent = { key: 'arrowleft', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        component.onKeyDown(keyBoardEvent);
        expect(component.clickLeft).toHaveBeenCalled();
    });
    
    it('should detect the right arrow key', () => {
        spyOn(component, 'clickRight');
        component.showLoadingWarning = false;
        component.showCarrousel = true;
        const keyBoardEvent = { key: 'arrowright', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        component.onKeyDown(keyBoardEvent);
        expect(component.clickRight).toHaveBeenCalled();
    });
    
    it('should get a drawing from the server', () => {
        getDrawingFromServerSpy.and.callThrough();
        component['getDrawingFromServer'](0);
        component.drawingsList = [];
        getDrawingFromServerSpy.and.callThrough();
        expect(component['getDrawingFromServer'](0)).toBeUndefined();
    });
});
