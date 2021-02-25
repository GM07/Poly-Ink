import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection-config',
    templateUrl: './rectangle-selection-config.component.html',
    styleUrls: ['./rectangle-selection-config.component.scss'],
})
export class RectangleSelectionConfigComponent extends ToolConfig implements OnDestroy, OnInit {
    isOverSelection: boolean = false;
    mouseDown: boolean = false;
    previewCanvas: HTMLCanvasElement;
    private lastCursor: string;

    constructor(public rectangleSelectionService: RectangleSelectionService, drawingService: DrawingService) {
        super();
        this.previewCanvas = drawingService.previewCanvas;
    }

    ngOnInit(): void {
        this.lastCursor = this.previewCanvas.style.cursor;
    }
    ngOnDestroy(): void {
        if (this.previewCanvas !== undefined) this.previewCanvas.style.cursor = this.lastCursor;
    }

    onMouseDown(event: MouseEvent) {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent) {
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent) {
        if (!this.mouseDown) {
            this.isOverSelection = this.rectangleSelectionService.isInSelection(event);
            if (this.isOverSelection) {
                this.previewCanvas.style.cursor = 'all-scroll';
            } else {
                this.previewCanvas.style.cursor = this.lastCursor;
            }
        }
    }
}
