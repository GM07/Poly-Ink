import { TestBed } from '@angular/core/testing';
import { PopupHandlerService } from './popup-handler.service';

describe('PopupHandlerService', () => {
    let service: PopupHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PopupHandlerService);
        service.initPopups();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should init popups', () => {
        service.newDrawing.showPopup = true;
        service.exportDrawing.showPopup = true;
        service.initPopups();
        expect(service.newDrawing.showPopup).toBe(false);
        expect(service.exportDrawing.showPopup).toBe(false);
    });

    it('should hide new drawing popup', () => {
        service.hideNewDrawingPopup();
        expect(service.newDrawing.showPopup).toBe(false);
    });

    it('should hide export drawing popup', () => {
        service.hideExportDrawingPopup();
        expect(service.exportDrawing.showPopup).toBe(false);
    });

    it('should show new drawing popup', () => {
        service.showNewDrawingPopup();
        expect(service.newDrawing.showPopup).toBe(true);
    });

    it('should show export drawing popup', () => {
        service.showExportDrawingPopup();
        expect(service.exportDrawing.showPopup).toBe(true);
    });

    it('should not show export drawing popup when new drawing is showing', () => {
        service.newDrawing.showPopup = true;
        expect(service.canShowExportDrawingPopup()).toBe(false);
    });

    it('should not show new drawing popup when export is showing', () => {
        service.exportDrawing.showPopup = true;
        expect(service.canShowNewDrawingPopup()).toBe(false);
    });

    it('should show export drawing popup when other popup not showing', () => {
        service.newDrawing.showPopup = false;
        service.exportDrawing.showPopup = true;
        expect(service.canShowExportDrawingPopup()).toBe(true);
    });

    it('should show new drawing popup when other popup not showing', () => {
        service.exportDrawing.showPopup = false;
        service.newDrawing.showPopup = true;
        expect(service.canShowNewDrawingPopup()).toBe(true);
    });

    it('should not show export drawing popup when popup is not showing', () => {
        service.hideExportDrawingPopup();
        expect(service.canShowExportDrawingPopup()).toBe(false);
    });

    it('should not show new darwing popup when popup is not showing', () => {
        service.hideNewDrawingPopup();
        expect(service.canShowNewDrawingPopup()).toBe(false);
    });
});
