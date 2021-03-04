import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { ExportDrawingComponent } from './export-drawing.component';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-empty */

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;

    let popupService: PopupHandlerService;
    let shortcutService: ShortcutHandlerService;
    let toolHandlerService: ToolHandlerService;

    let drawingService: DrawingService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            imports: [NoopAnimationsModule, MatButtonToggleModule, MatInputModule, FormsModule],
        }).compileComponents();

        toolHandlerService = TestBed.inject(ToolHandlerService);
        spyOn(toolHandlerService.getTool(), 'stopDrawing').and.callFake(() => {});

        shortcutService = TestBed.inject(ShortcutHandlerService);

        drawingService = TestBed.inject(DrawingService);
        drawServiceSpy = spyOnAllFunctions(drawingService);
        drawServiceSpy.canvas = document.createElement('canvas');
        drawServiceSpy.canvas.width = 300;
        drawServiceSpy.canvas.height = 300;
        drawServiceSpy.baseCtx = drawServiceSpy.canvas.getContext('2d') as CanvasRenderingContext2D;

        popupService = TestBed.inject(PopupHandlerService);
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
        expect(component.currentFilter).toBe('no');
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
        const hideSpy = spyOn(popupService, 'hideExportDrawingPopup').and.callThrough();
        component.hidePopup();
        expect(initSpy).toHaveBeenCalled();
        expect(hideSpy).toHaveBeenCalled();
    });

    it('should show popup', () => {
        popupService.showExportDrawingPopup();
        const showPopup = component.canShowPopup();
        expect(showPopup).toBe(true);
    });

    it('should not show popup', () => {
        popupService.showNewDrawingPopup();
        const showPopup = component.canShowPopup();
        expect(showPopup).toBe(false);
    });

    it('should export image with valid filename', () => {
        component['filename'] = 'test';
        const spy = spyOn(popupService.exportDrawing, 'exportImage').and.callFake(() => {});
        component.export();
        expect(spy).toHaveBeenCalledWith(component['canvasImage'], 'png', 'test');
    });

    it('should should change filename with invalid filename during export', () => {
        component['filename'] = '';
        const spy = spyOn(popupService.exportDrawing, 'exportImage').and.callFake(() => {});
        component.export();
        expect(spy).toHaveBeenCalledWith(component['canvasImage'], 'png', 'image');
    });

    it('should apply filter', async () => {
        component['currentFilter'] = 'negative';
        const context = component['exportPreview'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'red';
        context.fillRect(0, 0, 1, 1);
        await component.applyFilter();
        const imageData = context.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toBe(0);
        expect(imageData.data[1]).toBe(255);
        expect(imageData.data[2]).toBe(255);
    });

    it('should not apply filter if not valid', async () => {
        component['currentFilter'] = 'fake filter';
        const context = component['exportPreview'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
        await component.applyFilter();
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
        const applySpy = spyOn(component, 'applyFilter').and.callFake(async () => {});
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
        const popupSpy = spyOn(popupService, 'showExportDrawingPopup').and.callFake(() => {});
        const filterSpy = spyOn(component, 'applyFilter').and.callFake(async () => {});

        const event = { key: 'e', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(popupSpy).toHaveBeenCalled();
        expect(filterSpy).toHaveBeenCalled();
        expect(shortcutService.blockShortcuts).toBe(false);
    });

    it('should not open export popup', async () => {
        const popupSpy = spyOn(popupService, 'showExportDrawingPopup').and.callFake(() => {});
        const filterSpy = spyOn(component, 'applyFilter').and.callFake(async () => {});

        const event = { key: 'a', ctrlKey: true, shiftKey: false, altKey: false, preventDefault: () => {} } as KeyboardEvent;
        await component.onKeyDown(event);

        expect(popupSpy).not.toHaveBeenCalled();
        expect(filterSpy).not.toHaveBeenCalled();
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

        const shortcutSpy = spyOn(shortcutService, 'ignoreEvent').and.callThrough();
        const toolSpy = spyOn(toolHandlerService, 'onKeyDown').and.callThrough();
        await shortcutService.onKeyDown(event);
        expect(shortcutSpy).toHaveBeenCalled();
        expect(toolSpy).not.toHaveBeenCalled();
    });
});
