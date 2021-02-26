import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Filter } from '@app/classes/filters/filter';
import { NegativeFilter } from '@app/classes/filters/negative-filter';
import { NoFilter } from '@app/classes/filters/no-filter';
import { RandomFilter } from '@app/classes/filters/random-filter';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    static readonly EXPORT_PREVIEW_CANVAS_WIDTH = 300;
    static readonly EXPORT_PREVIEW_CANVAS_HEIGHT = 300;

    exportPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportPreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.exportPreview = element;
        }
    }

    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;

    private canvasImage: string;
    private imageData: ImageData;
    public exportFormat: string = 'png';
    public filename: string = 'Mona Lisa';
    public currentFilter: string = 'no';

    private filterMap: Map<String, Filter> = new Map([
        ['no', new NoFilter()],
        ['negative', new NegativeFilter()],
        ['random', new RandomFilter()],
    ]);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private popupHandlerService: PopupHandlerService,
        private shortcutHandler: ShortcutHandlerService,
    ) {}

    backupBaseCanvas() {
        this.baseCanvas = document.createElement('canvas');
        this.baseCanvas.width = this.drawingService.canvas.width;
        this.baseCanvas.height = this.drawingService.canvas.height;
        this.baseContext = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.baseContext.drawImage(this.drawingService.canvas, 0, 0);
    }

    hidePopup(): void {
        this.popupHandlerService.hideExportDrawingPopup();
        this.shortcutHandler.blockShortcuts = false;
    }

    showPopup(): boolean {
        return this.popupHandlerService.isExportDrawingPopupShowing();
    }

    export(): void {
        this.popupHandlerService.exportDrawing.exportImage(this.canvasImage, this.exportFormat, this.filename);
    }

    async applyFilter(): Promise<void> {
        console.log('filter changed: ' + this.currentFilter);
        let exportPreviewCtx = this.exportPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.baseContext.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);

        let filter = this.filterMap.get(this.currentFilter);
        if (filter !== undefined) {
            filter.apply(this.imageData);
        }

        await createImageBitmap(this.imageData).then((image) => {
            this.baseContext.drawImage(image, 0, 0);
            exportPreviewCtx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                ExportDrawingComponent.EXPORT_PREVIEW_CANVAS_WIDTH,
                ExportDrawingComponent.EXPORT_PREVIEW_CANVAS_HEIGHT,
            );
        });
        this.canvasImage = this.baseCanvas.toDataURL('image/' + this.exportFormat);
    }

    changeExportFormat(newFormat: string) {
        this.exportFormat = newFormat;
    }

    async changeFilter(newFilter: string) {
        this.currentFilter = newFilter;
        this.backupBaseCanvas();
        await this.applyFilter();
    }

    @HostListener('document:keydown', ['$event'])
    async onKeyDown(event: KeyboardEvent): Promise<void> {
        if (this.popupHandlerService.exportDrawing.shortcut.equals(event)) {
            event.preventDefault();
            this.popupHandlerService.showExportDrawingPopup();
            this.changeDetectorRef.detectChanges();
            this.backupBaseCanvas();
            await this.applyFilter();
            this.shortcutHandler.blockShortcuts = true;
        }
    }
}
