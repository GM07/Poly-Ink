import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Filter } from '@app/classes/filters/filter';
import { FunkyFilter } from '@app/classes/filters/funky-filter';
import { Monochrome } from '@app/classes/filters/monochrome-filter';
import { NegativeFilter } from '@app/classes/filters/negative-filter';
import { SepiaFilter } from '@app/classes/filters/sepia-filter';
import { SpotlightFilter } from '@app/classes/filters/spotlight-filter';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/popups/save-drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';


@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss']
})
export class SaveDrawingComponent {
     static readonly EXPORT_PREVIEW_MAX_SIZE: number = 300;

    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;
    private canvasImage: string;
    private imageData: ImageData;

    nameFormControl: FormControl;
    tagsFormControl: FormControl;
    saveFormat: string;
    filename: string;
    tagsStr: string;
    currentFilter: string;
    aspectRatio: number;

    private exportPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportPreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.exportPreview = element;
        }
    }

    private filterMap: Map<string, Filter> = new Map([
        ['no', new Filter()],
        ['negative', new NegativeFilter()],
        ['funky', new FunkyFilter()],
        ['spotlight', new SpotlightFilter()],
        ['sepia', new SepiaFilter()],
        ['monochrome', new Monochrome()],
    ]);

    private defaultFileNames: string[] = ['Mona Lisa', 'Guenica', 'Le Cri', 'La nuit étoilée', 'Impression, soleil levant'];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private shortcutHandler: ShortcutHandlerService,
        private saveDrawingService: SaveDrawingService,
    ) {
        this.initValues();
    }

    initValues(): void {
        this.nameFormControl = new FormControl('', Validators.required);
        this.tagsFormControl = new FormControl('', Validators.pattern('^([0-9A-Za-z -]+)(,[0-9A-Za-z -]+)*$'));
        this.saveFormat = 'png';
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
        this.saveDrawingService.showPopup = false;
        this.shortcutHandler.blockShortcuts = false;
        this.initValues();
    }

    canShowPopup(): boolean {
        return this.saveDrawingService.showPopup;
    }

    save(): void {
        if(!this.nameFormControl.errors && !this.tagsFormControl.errors){
            this.saveDrawingService.saveImage(this.canvasImage, this.saveFormat, this.filename);
        } 
    }

    async applyFilter(): Promise<void> {
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
        this.canvasImage = this.baseCanvas.toDataURL('image/' + this.saveFormat);
    }


    getPreviewHeight(): number {
        if (this.aspectRatio < 1) return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE / this.aspectRatio;
    }

    // Give access to html
    getPreviewWidth(): number {
        if (this.aspectRatio > 1) return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE * this.aspectRatio;
    }

    async show(): Promise<void> {
        this.shortcutHandler.blockShortcuts = true;
        this.saveDrawingService.showPopup = true;
        this.changeDetectorRef.detectChanges();
        this.backupBaseCanvas();
        await this.applyFilter();
    }

    @HostListener('document:keydown', ['$event'])
    async onKeyDown(event: KeyboardEvent): Promise<void> {
        if (!this.shortcutHandler.blockShortcuts && this.saveDrawingService.shortcut.equals(event)) {
            event.preventDefault();
            await this.show();
        }
    }
}
