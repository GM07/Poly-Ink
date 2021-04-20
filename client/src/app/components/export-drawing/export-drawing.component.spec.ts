import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ImgurResponse } from '@app/classes/imgur-res';
import { ImgurDataResponse } from '@app/classes/imgur-res-data';
import { Colors } from '@app/constants/colors';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/popups/export-drawing.service';
import { ExportImgurService } from '@app/services/popups/export-imgur.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { of } from 'rxjs';
import { ExportDrawingComponent } from './export-drawing.component';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-empty */
/* tslint:disable:no-any */

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;

    let exportDrawingService: ExportDrawingService;
    let exportImgurService: ExportImgurService;
    let shortcutService: ShortcutHandlerService;
    let toolHandlerService: ToolHandlerService;

    let drawingService: DrawingService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mockImgurResponse: ImgurResponse;
    let mockImgurResponseData: ImgurDataResponse;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            imports: [
                NoopAnimationsModule,
                MatButtonToggleModule,
                MatInputModule,
                FormsModule,
                FormsModule,
                HttpClientTestingModule,
                ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
            ],
        }).compileComponents();

        toolHandlerService = TestBed.inject(ToolHandlerService);
        spyOn(toolHandlerService.getCurrentTool(), 'stopDrawing');

        shortcutService = TestBed.inject(ShortcutHandlerService);

        drawingService = TestBed.inject(DrawingService);
        drawServiceSpy = spyOnAllFunctions(drawingService);
        drawServiceSpy.canvas = document.createElement('canvas');
        drawServiceSpy.canvas.width = 300;
        drawServiceSpy.canvas.height = 300;
        drawServiceSpy.baseCtx = drawServiceSpy.canvas.getContext('2d') as CanvasRenderingContext2D;

        exportDrawingService = TestBed.inject(ExportDrawingService);
        exportImgurService = TestBed.inject(ExportImgurService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component['baseCanvas'] = document.createElement('canvas');
        component['baseCanvas'].width = 300;
        component['baseCanvas'].height = 300;
        component['baseContext'] = component['baseCanvas'].getContext('2d') as CanvasRenderingContext2D;
        component['exportPreview'] = new ElementRef(component['baseCanvas']);
        mockImgurResponse = new ImgurResponse();
        mockImgurResponseData = new ImgurDataResponse();
        mockImgurResponseData.link = 'https://imgur.com/234';
        mockImgurResponseData.name = 'drawing_link';
        mockImgurResponseData.type = 'png';
        mockImgurResponse.data = mockImgurResponseData;
        mockImgurResponse.status = '200';
        mockImgurResponse.success = true;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init values', () => {
        const randomStub = spyOn(Math, 'random').and.returnValue(0.4);

        component.exportFormat = 'jpg';
        component.currentFilter = 'sepia';
        component.aspectRatio = 2;
        component.filename = 'Mona Lisa';

        component.initValues();
        expect(component.exportFormat).toBe('png');
        expect(component.currentFilter).toBe('default');
        expect(component.aspectRatio).toBe(1);
        expect(randomStub).toHaveBeenCalled();
        expect(component.filename).toBe('Le Cri');
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
        expect(exportDrawingService.showPopup).toBeFalsy();
    });

    it('should show popup', () => {
        exportDrawingService.showPopup = true;
        expect(component.canShowPopup()).toBeTruthy();
    });

    it('should not show popup', () => {
        exportDrawingService.showPopup = false;
        expect(component.canShowPopup()).toBeFalsy();
    });

    it('should export image while changing filename from form', () => {
        // We need to use Object to change the value of the form (readonly)
        Object.defineProperty(component.nameFormControl, 'valid', { value: true });
        Object.defineProperty(component.nameFormControl, 'value', { value: 'test' });

        const spy = spyOn(exportDrawingService, 'exportImage');
        component.export('local-export');
        expect(spy).toHaveBeenCalledWith(component['canvasImage'], 'png', 'test');
    });

    it('should apply filter', async () => {
        component['currentFilter'] = 'negative';
        const context = component['exportPreview'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'red';
        context.fillRect(0, 0, 1, 1);
        await component['applyFilter']();
        const imageData = context.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toBe(0);
        expect(imageData.data[1]).toBe(255);
        expect(imageData.data[2]).toBe(255);
    });

    it('should not apply filter if not valid', async () => {
        component['currentFilter'] = 'fake filter';
        const context = component['exportPreview'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = Colors.WHITE.rgbString;
        context.fillRect(0, 0, 1, 1);
        await component['applyFilter']();
        const imageData = context.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toBe(255);
        expect(imageData.data[1]).toBe(255);
        expect(imageData.data[2]).toBe(255);
    });

    it('should change export format', () => {
        component.changeExportFormat('jpg');
        expect(component.exportFormat).toBe('jpg');
    });

    it('should change filter', () => {
        const applySpy = spyOn<any>(component, 'applyFilter').and.callFake(async () => {});
        const backupSpy = spyOn(component, 'backupBaseCanvas').and.callFake(async () => {});

        component.changeFilter('funky');
        expect(component.currentFilter).toBe('funky');
        expect(applySpy).toHaveBeenCalled();
        expect(backupSpy).toHaveBeenCalled();
    });

    it('should return preview height based on aspect ratio', () => {
        component.aspectRatio = 2;
        const height = component.getPreviewHeight();
        expect(height).toBe(150);
    });

    it('should return preview width', () => {
        expect(component.getPreviewWidth()).toBe(300);
    });

    it('should open export popup', async () => {
        const showSpy = spyOn(component, 'show').and.callFake(async () => {});

        const event = { key: 'e', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(showSpy).toHaveBeenCalled();
    });

    it('should not open export popup', async () => {
        const showSpy = spyOn(component, 'show').and.callFake(async () => {});

        const event = { key: 'a', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(showSpy).not.toHaveBeenCalled();
    });

    it('should apply filter when showing', async () => {
        const spyApply = spyOn<any>(component, 'applyFilter').and.callFake(async () => {});

        await component.show();
        expect(spyApply).toHaveBeenCalled();
    });

    it('should ignore ctrl events', async () => {
        const event = {
            key: 'e',
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
        expect(returnValue).toBe(ExportDrawingComponent['EXPORT_PREVIEW_MAX_SIZE']);
    });

    it('should choose width when bigger', () => {
        component.aspectRatio = 2;
        const returnValue = component.getPreviewWidth();
        expect(returnValue).toBe(ExportDrawingComponent['EXPORT_PREVIEW_MAX_SIZE']);
    });

    it('should not export if name is invalid', () => {
        // We need to use Object to change the value of the form (readonly)
        Object.defineProperty(component.nameFormControl, 'valid', { value: false });
        component.export('local-export');

        const spy = spyOn(exportDrawingService, 'exportImage').and.callThrough();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should export if name is valid', () => {
        // We need to use Object to change the value of the form (readonly)
        Object.defineProperty(component.nameFormControl, 'valid', { value: true });
        component.export('local-export');

        const spy = spyOn(exportDrawingService, 'exportImage');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should reset imgur data on filter change', () => {
        component.imgurURL = 'https://www.imgur.com/234';
        component.hasImgurServerError = true;
        component.changeFilter('default');
        expect(component.imgurURL).toBe('');
        expect(component.hasImgurServerError).toBeFalsy();
    });

    it('should reset imgur data on export formmat change', () => {
        component.imgurURL = 'https://www.imgur.com/234';
        component.hasImgurServerError = true;
        component.changeExportFormat('png');
        expect(component.imgurURL).toBe('');
        expect(component.hasImgurServerError).toBeFalsy();
    });

    it('should reset imgur data on init', () => {
        component.imgurURL = 'https://www.imgur.com/234';
        component.hasImgurServerError = true;
        component.initValues();
        expect(component.imgurURL).toBe('');
        expect(component.hasImgurServerError).toBeFalsy();
    });

    it('should export image using Imgur service on imgur-export submitter id and change the link on a successful request', () => {
        // We need to use Object to change the value of the form (readonly)
        Object.defineProperty(component.nameFormControl, 'valid', { value: true });
        spyOn<any>(exportImgurService, 'exportImage').and.returnValue(of(Promise.resolve(mockImgurResponse)));
        component.export('imgur-export');
        setTimeout(() => {
            expect(component.imgurURL).toEqual(mockImgurResponse.data.link);
        });
        expect(exportImgurService.exportImage).toHaveBeenCalled();
    });

    it('should export image using Imgur service on imgur-export submitter id and set server error flag on failed request', () => {
        // We need to use Object to change the value of the form (readonly)
        Object.defineProperty(component.nameFormControl, 'valid', { value: true });
        mockImgurResponse.status = '400';
        mockImgurResponse.success = false;
        spyOn<any>(exportImgurService, 'exportImage').and.returnValue(of(Promise.reject(mockImgurResponse)));
        component.export('imgur-export');
        setTimeout(() => {
            expect(component.imgurURL).toEqual('');
            expect(component.hasImgurServerError).toBeTruthy();
        });
        expect(exportImgurService.exportImage).toHaveBeenCalled();
    });
});
