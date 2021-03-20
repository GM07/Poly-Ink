import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dummyDrawing } from '@app/services/carrousel/carrousel.const';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/popups/save-drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
import { SaveDrawingComponent } from './save-drawing.component';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-empty */
describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;

    let saveDrawingService: SaveDrawingService;
    let shortcutService: ShortcutHandlerService;
    let toolHandlerService: ToolHandlerService;
    let carrouselService: CarrouselService;

    let drawingService: DrawingService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            imports: [
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatButtonToggleModule,
                MatInputModule,
                FormsModule,
                ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
            ],
        }).compileComponents();

        toolHandlerService = TestBed.inject(ToolHandlerService);
        spyOn(toolHandlerService.getCurrentTool(), 'stopDrawing').and.callFake(() => {});
        shortcutService = TestBed.inject(ShortcutHandlerService);
        carrouselService = TestBed.inject(CarrouselService);
        drawingService = TestBed.inject(DrawingService);
        drawServiceSpy = spyOnAllFunctions(drawingService);
        drawServiceSpy.canvas = document.createElement('canvas');
        drawServiceSpy.canvas.width = 300;
        drawServiceSpy.canvas.height = 300;
        drawServiceSpy.baseCtx = drawServiceSpy.canvas.getContext('2d') as CanvasRenderingContext2D;

        saveDrawingService = TestBed.inject(SaveDrawingService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component['baseCanvas'] = document.createElement('canvas');
        component['baseCanvas'].width = 300;
        component['baseCanvas'].height = 300;
        component['baseContext'] = component['baseCanvas'].getContext('2d') as CanvasRenderingContext2D;
        component['savePreview'] = new ElementRef(component['baseCanvas']);
        component['canvasImage'] = dummyDrawing.image;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init values', () => {
        const randomValue = 0.4;
        const randomStub = spyOn(Math, 'random').and.returnValue(randomValue);

        component.saveFormat = 'jpg';
        component.enableAcceptButton = false;
        component.aspectRatio = 2;

        component.initValues();
        expect(component.enableAcceptButton).toBeTruthy();
        expect(component.saveFormat).toBe('png');
        expect(component.aspectRatio).toBe(1);
        expect(component.nameFormControl.validator).toBeTruthy();
        expect(component.tagsFormControl.validator).toBeTruthy();
        expect(randomStub).toHaveBeenCalled();
    });

    it('should backup base canvas', () => {
        component.backupBaseCanvas();
        expect(component['baseCanvas'].width).toBe(drawServiceSpy.canvas.width);
        expect(component['baseCanvas'].height).toBe(drawServiceSpy.canvas.height);
    });

    it('should hide popup', () => {
        const initSpy = spyOn(component, 'initValues').and.callThrough();
        component.hidePopup();
        expect(initSpy).toHaveBeenCalled();
        expect(saveDrawingService.showPopup).toBeFalsy();
    });

    it('should show popup', () => {
        saveDrawingService.showPopup = true;
        expect(component.canShowPopup()).toBeTruthy();
    });

    it('should not show popup', () => {
        saveDrawingService.showPopup = false;
        expect(component.canShowPopup()).toBeFalsy();
    });

    it('should save image with valid file name and empty tags', async () => {
        const spy = spyOn(carrouselService, 'createDrawing').and.returnValue(new Observable());
        const mockDrawing: Drawing = new Drawing(new DrawingData(''));
        mockDrawing.image = component['canvasImage'];
        component.save();
        expect(spy).toHaveBeenCalled();
    });

    it('should save the image with valid file name and tags', async () => {
        const spy = spyOn(carrouselService, 'createDrawing').and.returnValue(new Observable());
        component.saveForm.controls['tagsFormControl'].setValue('tag1,tag2');
        const mockDrawing: Drawing = new Drawing(new DrawingData(''));
        mockDrawing.image = component['canvasImage'];
        component.save();
        expect(spy).toHaveBeenCalled();
    });

    it('should not save the image when name is empty and validators have errors', async () => {
        const spy = spyOn(carrouselService, 'createDrawing').and.returnValue(new Observable());
        component.nameFormControl.setErrors({ required: true });
        component.save();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should hide the popup on a successful request', async () => {
        spyOn(component, 'hidePopup').and.callFake(() => {});
        spyOn(carrouselService, 'createDrawing').and.callFake((drawing: Drawing) => {
            return of(Promise.resolve(new HttpResponse({ status: 200 })));
        });
        await component.save();
        expect(component.hidePopup).toHaveBeenCalled();
    });

    it('should not hide the popup on a bad request and should enable noServerConnection boolean on component', async () => {
        spyOn(component, 'hidePopup').and.callFake(() => {});
        spyOn(carrouselService, 'createDrawing').and.callFake((drawing: Drawing) => {
            return of(Promise.reject(new HttpErrorResponse({ status: 400 })));
        });
        await component.save();
        expect(component.hidePopup).not.toHaveBeenCalled();
        expect(component.noServerConnection).toBeTruthy();
    });

    it('should not hide the popup on a bad request and should enable noServerConnection boolean on component', async () => {
        spyOn(component, 'hidePopup').and.callFake(() => {});
        spyOn(carrouselService, 'createDrawing').and.callFake((drawing: Drawing) => {
            return of(Promise.reject(new HttpErrorResponse({ status: 401 })));
        });
        await component.save();
        expect(component.hidePopup).not.toHaveBeenCalled();
        expect(component.noServerConnection).toBeTruthy();
    });

    it('should not hide the popup on a bad request and should enable unavailableServer error boolean on component', async () => {
        spyOn(component, 'hidePopup').and.callFake(() => {});
        spyOn(carrouselService, 'createDrawing').and.callFake((drawing: Drawing) => {
            return of(Promise.reject(new HttpErrorResponse({ status: 503 })));
        });
        await component.save();
        expect(component.hidePopup).not.toHaveBeenCalled();
        expect(component.unavailableServer).toBeTruthy();
    });

    it('should not hide the popup on a bad request and should enable dataLimitReached error boolean on component', async () => {
        spyOn(component, 'hidePopup').and.callFake(() => {});
        spyOn(carrouselService, 'createDrawing').and.callFake((drawing: Drawing) => {
            return of(Promise.reject(new HttpErrorResponse({ status: 413 })));
        });
        await component.save();
        expect(component.hidePopup).not.toHaveBeenCalled();
        expect(component.dataLimitReached).toBeTruthy();
    });

    it('should return preview height based on aspect ratio', () => {
        component.aspectRatio = 2;
        const height = component.getPreviewHeight();
        expect(height).toBe(150);
    });

    it('should return preview width', () => {
        expect(component.getPreviewWidth()).toBe(300);
    });

    it('should open save popup on shortcut', async () => {
        const showSpy = spyOn(component, 'show').and.callFake(async () => {});

        const event = { key: 's', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(showSpy).toHaveBeenCalled();
    });

    it('should not open save popup on a different key', async () => {
        const showSpy = spyOn(component, 'show').and.callFake(async () => {});

        const event = { key: 'a', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(showSpy).not.toHaveBeenCalled();
    });

    it('should ignore ctrl events', async () => {
        const event = {
            key: 's',
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            preventDefault: () => {},
            stopImmediatePropagation: () => {},
        } as KeyboardEvent;
        await component.onKeyDown(event);

        const toolSpy = spyOn(toolHandlerService, 'onKeyDown').and.callThrough();
        await shortcutService.onKeyDown(event);
        expect(toolSpy).not.toHaveBeenCalled();
    });

    it('should choose height when bigger', () => {
        component.aspectRatio = 0.5;
        const returnValue = component.getPreviewHeight();
        expect(returnValue).toBe(SaveDrawingComponent['EXPORT_PREVIEW_MAX_SIZE']);
    });

    it('should choose width when bigger', () => {
        component.aspectRatio = 2;
        const returnValue = component.getPreviewWidth();
        expect(returnValue).toBe(SaveDrawingComponent['EXPORT_PREVIEW_MAX_SIZE']);
    });
});
