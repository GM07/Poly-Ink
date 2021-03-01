import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Filter } from '@app/classes/filters/filter';
import { FunkyFilter } from '@app/classes/filters/funky-filter';
import { NegativeFilter } from '@app/classes/filters/negative-filter';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    private static readonly EXPORT_PREVIEW_CANVAS_WIDTH = 500;

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
    public exportFormat: string;
    public filename: string;
    public currentFilter: string;
    public aspectRatio: number;

    private filterMap: Map<String, Filter> = new Map([
        ['no', new Filter()],
        ['negative', new NegativeFilter()],
        ['funky', new FunkyFilter()],
    ]);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private popupHandlerService: PopupHandlerService,
        private shortcutHandler: ShortcutHandlerService,
    ) {
        this.initValues();
    }

    initValues(): void {
        this.exportFormat = 'png';
        this.filename = 'Mona Lisa';
        this.currentFilter = 'no';
        this.aspectRatio = 1;
    }

    backupBaseCanvas(): void {
        this.baseCanvas = document.createElement('canvas');
        this.baseCanvas.width = this.drawingService.canvas.width;
        this.baseCanvas.height = this.drawingService.canvas.height;
        this.baseContext = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.baseContext.drawImage(this.drawingService.canvas, 0, 0);
    }

    hidePopup(): void {
        this.popupHandlerService.hideExportDrawingPopup();
        this.shortcutHandler.blockShortcuts = false;
        this.initValues();
    }

    showPopup(): boolean {
        return this.popupHandlerService.isExportDrawingPopupShowing();
    }

    export(): void {
        this.popupHandlerService.exportDrawing.exportImage(this.canvasImage, this.exportFormat, this.filename);
    }

    async applyFilter(): Promise<void> {
        let exportPreviewCtx = this.exportPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.baseContext.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);

        this.aspectRatio = this.baseCanvas.width / this.baseCanvas.height;

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
                this.getPreviewHeight(),
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

    getPreviewHeight(): number {
        return ExportDrawingComponent.EXPORT_PREVIEW_CANVAS_WIDTH / Math.max(1, this.aspectRatio);
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
