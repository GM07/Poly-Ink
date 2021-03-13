import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawing } from '@app/services/popups/export-drawing';
import { NewDrawing } from '@app/services/popups/new-drawing';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Injectable({
    providedIn: 'root',
})
export class PopupHandlerService {
    newDrawing: NewDrawing;
    exportDrawing: ExportDrawing;

    constructor(drawingService: DrawingService, private toolHandler: ToolHandlerService) {
        this.newDrawing = new NewDrawing(drawingService, toolHandler);
        this.exportDrawing = new ExportDrawing();
    }

    initPopups(): void {
        this.newDrawing.showPopup = false;
        this.exportDrawing.showPopup = false;
    }

    hideNewDrawingPopup(): void {
        this.newDrawing.showPopup = false;
    }

    showNewDrawingPopup(): void {
        this.toolHandler.getCurrentTool().stopDrawing();
        this.newDrawing.showPopup = true;
    }

    canShowNewDrawingPopup(): boolean {
        return this.newDrawing.showPopup && !this.exportDrawing.showPopup;
    }

    hideExportDrawingPopup(): void {
        this.exportDrawing.showPopup = false;
    }

    showExportDrawingPopup(): void {
        this.toolHandler.getCurrentTool().stopDrawing();
        this.exportDrawing.showPopup = true;
    }

    canShowExportDrawingPopup(): boolean {
        return this.exportDrawing.showPopup && !this.newDrawing.showPopup;
    }
}
