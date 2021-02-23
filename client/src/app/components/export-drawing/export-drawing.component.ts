import { AfterViewInit, Component, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupHandlerService } from '@app/services/popups/popup-handler.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements AfterViewInit {

    static readonly EXPORT_PREVIEW_CANVAS_WIDTH = 300;
    static readonly EXPORT_PREVIEW_CANVAS_HEIGHT = 300;

    exportPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportPreview', { static: false }) set content(element: ElementRef) {
        if(element) {
            this.exportPreview = element;
        }
    };
    private exportPreviewCtx: CanvasRenderingContext2D;
    private exportFormat: string = 'png';
    private canvasImage: string;

    constructor(private changeDetectorRef: ChangeDetectorRef, private drawingService: DrawingService, private popupHandlerService: PopupHandlerService, private shortcutHandler: ShortcutHandlerService) {
    }

    ngAfterViewInit(): void {
    }
    
    hidePopup(): void {
        this.popupHandlerService.hideExportDrawingPopup();
    }
    
    showPopup(): boolean {
        return this.popupHandlerService.isExportDrawingPopupShowing();
    }
    
    export(): void {
        this.popupHandlerService.exportDrawing.exportImage(this.exportPreview.nativeElement, this.exportFormat, 'image');
    }
    
    saveBaseCanvas(): void {
        this.canvasImage = this.drawingService.canvas.toDataURL('image/' + this.exportFormat);
        this.exportPreviewCtx = this.exportPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        
        let ctx = this.exportPreviewCtx;
        let preview = new Image;
        preview.onload = function () {
            ctx?.drawImage(preview, 0, 0, preview.width, preview.height, 0, 0, ExportDrawingComponent.EXPORT_PREVIEW_CANVAS_WIDTH, ExportDrawingComponent.EXPORT_PREVIEW_CANVAS_HEIGHT);
        }
        preview.src = this.canvasImage;
    }

    changeExportFormat(value: string) {
        this.exportFormat = value;
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        
        if (this.popupHandlerService.exportDrawing.shortcut.equals(event)) {
            event.preventDefault();
            this.popupHandlerService.showExportDrawingPopup();
            this.changeDetectorRef.detectChanges();
            this.saveBaseCanvas();
            // TODO: Pourquoi il etait a vrai
            this.shortcutHandler.blockShortcuts = false;
        }
    }
}
