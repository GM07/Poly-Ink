import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingConstants } from '@app/constants/drawing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/popups/save-drawing.service';
import { ServerCommunicationService } from '@app/services/server-communication/server-communication.service';
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
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    private baseCanvas: HTMLCanvasElement;
    private baseContext: CanvasRenderingContext2D;
    private canvasImage: string;
    private imageData: ImageData;
    private savePreview: ElementRef<HTMLCanvasElement>;

    visible: boolean;
    selectable: boolean;
    removable: boolean;
    addOnBlur: boolean;
    enableAcceptButton: boolean;
    noServerConnection: boolean;
    dataLimitReached: boolean;
    saveFormat: string;
    aspectRatio: number;
    unavailableServer: boolean;
    saveForm: FormGroup;
    saveTags: Tag[];

    @ViewChild('savePreview', { static: false }) set content(element: ElementRef) {
        if (element) {
            this.savePreview = element;
        }
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private shortcutHandler: ShortcutHandlerService,
        private saveDrawingService: SaveDrawingService,
        private serverCommunicationService: ServerCommunicationService,
    ) {
        this.initValues();
    }

    get nameFormControl(): AbstractControl {
        return this.saveForm.get('nameFormControl') as AbstractControl;
    }

    get tagsFormControl(): AbstractControl {
        return this.saveForm.get('tagsFormControl') as AbstractControl;
    }

    initValues(): void {
        this.visible = true;
        this.removable = true;
        this.selectable = true;
        this.noServerConnection = false;
        this.unavailableServer = false;
        this.enableAcceptButton = true;
        this.saveFormat = 'png';
        this.aspectRatio = 1;
        this.saveTags = [];
        this.saveForm = new FormGroup({
            nameFormControl: new FormControl(
                DrawingConstants.defaultFileNames[Math.floor(Math.random() * DrawingConstants.defaultFileNames.length)],
                [Validators.required, Validators.pattern('(?! )[a-zA-Z0-9\u00C0-\u017F, ]*(?<! )')],
            ),
            tagsFormControl: new FormControl([], Validators.pattern('^([ ]*[0-9A-Za-z-]+[ ]*)(,[ ]*[0-9A-Za-z-]+[ ]*)*$')),
        });
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

    async save(): Promise<void> {
        if (!this.nameFormControl.errors && !this.tagsFormControl.errors) {
            this.enableAcceptButton = false;
            this.noServerConnection = false;
            this.unavailableServer = false;
            this.dataLimitReached = false;
            const tagsSet: Set<string> = new Set();
            this.saveTags.forEach((tag: Tag) => {
                tagsSet.add(tag.name);
            });
            // Filter tags to keep them unique
            const tags: Tag[] = [];
            tagsSet.forEach((uniqueTag: string) => {
                tags.push(new Tag(uniqueTag));
            });
            const newDrawing: Drawing = new Drawing(new DrawingData(this.nameFormControl.value as string, tags));
            newDrawing.image = this.canvasImage;
            this.enableAcceptButton = false;

            try {
                await this.serverCommunicationService.createDrawing(newDrawing).toPromise();
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

    getPreviewHeight(): number {
        if (this.aspectRatio < 1) return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE / this.aspectRatio;
    }

    // Give access to html
    getPreviewWidth(): number {
        if (this.aspectRatio > 1) return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE;

        return SaveDrawingComponent.EXPORT_PREVIEW_MAX_SIZE * this.aspectRatio;
    }

    removeTag(tag: Tag): void {
        const tagIndex = this.tagsFormControl.value.indexOf(tag.name);
        if (tagIndex >= 0) {
            this.tagsFormControl.value.splice(tagIndex, 1);
            this.saveTags.splice(tagIndex, 1);
            this.tagsFormControl.updateValueAndValidity();
        }
    }

    addTag(event: MatChipInputEvent): void {
        const value = event.value;
        if (value.trim()) {
            this.tagsFormControl.value.push(value.trim());
            this.tagsFormControl.updateValueAndValidity();
            this.saveTags.push(new Tag(value.trim()));
        }
        event.input.value = '';
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
    private async generatePreviewData(): Promise<void> {
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
}
