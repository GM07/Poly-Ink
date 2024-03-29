import { TestBed } from '@angular/core/testing';
import { ExportDrawingService } from './export-drawing';

describe('ExportDrawing', () => {
    let service: ExportDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new ExportDrawingService();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should export image', () => {
        const createSpy = spyOn(document, 'createElement').and.callThrough();
        const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
        const format = 'png';
        const image = 'image/png - 0 - 255 - 255';

        service.exportImage(image, format, 'test');
        expect(createSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
});
