import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Filter } from '@app/classes/filters/filter';
import { FunkyFilter } from '@app/classes/filters/funky-filter';
import { Monochrome } from '@app/classes/filters/monochrome-filter';
import { NegativeFilter } from '@app/classes/filters/negative-filter';
import { SepiaFilter } from '@app/classes/filters/sepia-filter';
import { SpotlightFilter } from '@app/classes/filters/spotlight-filter';
import { DrawingConstants } from '@app/constants/drawing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/popups/export-drawing';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    private static readonly EXPORT_PREVIEW_MAX_SIZE: number = 300;

    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;
    private canvasImage: string;
    private imageData: ImageData;
    private defaultFileNames: string[];
    exportFormat: string;
    filename: string;
    currentFilter: string = 'default';
    aspectRatio: number;

    private exportPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportPreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.exportPreview = element;
        }
    }

    private filterMap: Map<string, Filter> = new Map([
        ['default', new Filter()],
        ['negative', new NegativeFilter()],
        ['funky', new FunkyFilter()],
        ['spotlight', new SpotlightFilter()],
        ['sepia', new SepiaFilter()],
        ['monochrome', new Monochrome()],
    ]);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private shortcutHandler: ShortcutHandlerService,
        private exportDrawingService: ExportDrawingService,
    ) {
        this.initValues();
    }

    initValues(): void {
        this.defaultFileNames = DrawingConstants.defaultFileNames;
        this.exportFormat = 'png';
        this.currentFilter = 'default';
        this.aspectRatio = 1;
        this.filename = this.defaultFileNames[Math.floor(Math.random() * this.defaultFileNames.length)];
    }

    backupBaseCanvas(): void {
        this.baseCanvas = document.createElement('canvas');
        this.baseCanvas.width = this.drawingService.canvas.width;
        this.baseCanvas.height = this.drawingService.canvas.height;
        this.baseContext = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.baseContext.drawImage(this.drawingService.canvas, 0, 0);
    }

    hidePopup(): void {
        this.exportDrawingService.showPopup = false;
        this.shortcutHandler.blockShortcuts = false;
        this.initValues();
    }

    canShowPopup(): boolean {
        return this.exportDrawingService.showPopup;
    }

    export(): void {
        this.exportDrawingService.exportImage(this.canvasImage, this.exportFormat, this.filename === '' ? 'image' : this.filename);
    }

    private async applyFilter(): Promise<void> {
        const exportPreviewCtx = this.exportPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.baseContext.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);

        this.aspectRatio = this.baseCanvas.width / this.baseCanvas.height;

        const filter = this.filterMap.get(this.currentFilter);
        if (filter !== undefined) {
            filter.apply(this.imageData);
        }

        await createImageBitmap(this.imageData).then((image) => {
            this.baseContext.drawImage(image, 0, 0);
            exportPreviewCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.getPreviewWidth(), this.getPreviewHeight());
        });
        this.canvasImage = this.baseCanvas.toDataURL('image/' + this.exportFormat);
    }

    async changeExportFormat(newFormat: string): Promise<void> {
        this.exportFormat = newFormat;
        await this.changeFilter(this.currentFilter);
    }

    async changeFilter(newFilter: string): Promise<void> {
        this.currentFilter = newFilter;
        this.backupBaseCanvas();
        await this.applyFilter();
    }

    getPreviewHeight(): number {
        if (this.aspectRatio < 1) return ExportDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return ExportDrawingComponent.EXPORT_PREVIEW_MAX_SIZE / this.aspectRatio;
    }

    // Give access to html
    getPreviewWidth(): number {
        if (this.aspectRatio > 1) return ExportDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return ExportDrawingComponent.EXPORT_PREVIEW_MAX_SIZE * this.aspectRatio;
    }

    async show(): Promise<void> {
        this.shortcutHandler.blockShortcuts = true;
        this.exportDrawingService.showPopup = true;
        this.changeDetectorRef.detectChanges();
        this.backupBaseCanvas();
        await this.applyFilter();
    }

    @HostListener('document:keydown', ['$event'])
    async onKeyDown(event: KeyboardEvent): Promise<void> {
        if (!this.shortcutHandler.blockShortcuts && this.exportDrawingService.shortcut.equals(event)) {
            event.preventDefault();
            await this.show();
        }
    }
}
