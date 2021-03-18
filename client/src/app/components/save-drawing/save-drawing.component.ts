import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/popups/save-drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    static readonly EXPORT_PREVIEW_MAX_SIZE: number = 300;
    static readonly BAD_REQUEST_STATUS: number = 400;
    static readonly UNAVAILABLE_SERVER_STATUS: number = 503;
    static readonly DATA_LIMIT_REACHED: number = 413;
    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;
    private canvasImage: string;
    private imageData: ImageData;
    private savePreview: ElementRef<HTMLCanvasElement>;
    private defaultFileNames: string[] = ['Mona Lisa', 'Guenica', 'Le Cri', 'La nuit étoilée', 'Impression, soleil levant'];

    enableAcceptButton: boolean;
    noServerConnection: boolean;
    dataLimitReached: boolean;
    nameFormControl: FormControl;
    tagsFormControl: FormControl;
    saveFormat: string;
    filename: string;
    tagsStr: string;
    aspectRatio: number;
    unavailableServer: boolean;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private shortcutHandler: ShortcutHandlerService,
        private saveDrawingService: SaveDrawingService,
        private carrouselService: CarrouselService,
    ) {
        this.initValues();
    }

    @ViewChild('savePreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.savePreview = element;
        }
    }

    initValues(): void {
        this.noServerConnection = false;
        this.unavailableServer = false;
        this.enableAcceptButton = true;
        this.saveFormat = 'png';
        this.aspectRatio = 1;
        this.filename = this.defaultFileNames[Math.floor(Math.random() * this.defaultFileNames.length)];
        this.nameFormControl = new FormControl(this.filename, Validators.required);
        this.tagsFormControl = new FormControl('', Validators.pattern('^([ ]*[0-9A-Za-z-]+[ ]*)(,[ ]*[0-9A-Za-z-]+[ ]*)*$'));
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
        this.tagsStr = '';
        this.initValues();
    }

    canShowPopup(): boolean {
        return this.saveDrawingService.showPopup;
    }

    async save(): Promise<void> {
        if (!this.nameFormControl.errors && !this.tagsFormControl.errors) {
            this.enableAcceptButton = false;
            this.noServerConnection = false;
            this.unavailableServer = false;
            this.dataLimitReached = false;
            let tags: Tag[] = [];
            if (this.tagsStr) {
                tags = this.tagsStr.split(',').map((tagStr: string) => {
                    return new Tag(tagStr);
                });
            }
            const newDrawing: Drawing = new Drawing(new DrawingData(this.filename, tags));
            newDrawing.image = this.canvasImage;
            this.enableAcceptButton = false;

            try {
                await this.carrouselService.createDrawing(newDrawing).toPromise();
                this.hidePopup();
            } catch (reason) {
                if (reason.status === SaveDrawingComponent.UNAVAILABLE_SERVER_STATUS) {
                    this.unavailableServer = true;
                } else if (reason.status === SaveDrawingComponent.DATA_LIMIT_REACHED) {
                    this.dataLimitReached = true;
                } else {
                    this.noServerConnection = true;
                }
            }
            this.enableAcceptButton = true;
        }
    }

    async generatePreviewData(): Promise<void> {
        const exportPreviewCtx = this.savePreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.baseContext.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);

        this.aspectRatio = this.baseCanvas.width / this.baseCanvas.height;

        await createImageBitmap(this.imageData).then((image) => {
            this.baseContext.drawImage(image, 0, 0);
            exportPreviewCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.getPreviewWidth(), this.getPreviewHeight());
        });
    }

    private generateBase64Image(): void {
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
        this.generateBase64Image();
        await this.generatePreviewData();
    }

    @HostListener('document:keydown', ['$event'])
    async onKeyDown(event: KeyboardEvent): Promise<void> {
        if (!this.shortcutHandler.blockShortcuts && this.saveDrawingService.shortcut.equals(event)) {
            event.preventDefault();
            await this.show();
        }
    }
}
