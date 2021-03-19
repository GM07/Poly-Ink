import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawingConstants } from '@app/constants/drawing';
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
export class SaveDrawingComponent implements OnInit {
    static readonly EXPORT_PREVIEW_MAX_SIZE: number = 300;
    static readonly BAD_REQUEST_STATUS: number = 400;
    static readonly UNAVAILABLE_SERVER_STATUS: number = 503;
    static readonly DATA_LIMIT_REACHED: number = 413;
    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;
    private canvasImage: string;
    private imageData: ImageData;
    private savePreview: ElementRef<HTMLCanvasElement>;
    private defaultFileNames: string[];

    enableAcceptButton: boolean;
    noServerConnection: boolean;
    dataLimitReached: boolean;
    saveFormat: string;
    filename: string;
    tagsStr: string;
    aspectRatio: number;
    unavailableServer: boolean;
    saveForm: FormGroup;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private shortcutHandler: ShortcutHandlerService,
        private saveDrawingService: SaveDrawingService,
        private carrouselService: CarrouselService,
    ) {
        this.initValues();
    }

    ngOnInit(): void {
        this.saveForm = new FormGroup({
            nameFormControl: new FormControl(this.filename, [Validators.required]),
            tagsFormControl: new FormControl(this.tagsStr, [Validators.pattern('^([ ]*[0-9A-Za-z-]+[ ]*)(,[ ]*[0-9A-Za-z-]+[ ]*)*$')]),
        });
    }

    @ViewChild('savePreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.savePreview = element;
        }
    }

    get nameFormControl(): AbstractControl {
        return this.saveForm.get('nameFormControl') as AbstractControl;
    }

    get tagsFormControl(): AbstractControl {
        return this.saveForm.get('tagsFormControl') as AbstractControl;
    }

    initValues(): void {
        this.defaultFileNames = DrawingConstants.defaultFileNames;
        this.noServerConnection = false;
        this.unavailableServer = false;
        this.enableAcceptButton = true;
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
            const tagsSet: Set<string> = new Set();
            if (this.tagsStr) {
                this.tagsStr.split(',').forEach((tagStr: string) => {
                    tagsSet.add(tagStr.trim());
                });
            }
            // Filter tags to keep them unique
            const tags: Tag[] = [];
            tagsSet.forEach((uniqueTag: string) => {
                tags.push(new Tag(uniqueTag));
            });
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
