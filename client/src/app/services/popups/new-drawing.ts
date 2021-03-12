import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { CanvasConst } from '@app/constants/canvas';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

export class NewDrawing {
    showPopup: boolean;
    shortcut: ShortcutKey;

    static isNotEmpty(baseCtx: CanvasRenderingContext2D, width: number, height: number): boolean {
        const whiteColor = 4294967295; // White color constant
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, width, height).data.buffer);
        return pixelBuffer.some((color) => color !== whiteColor) && pixelBuffer.some((color) => color !== 0);
    }

    constructor(private drawingService: DrawingService, private toolHandler: ToolHandlerService) {
        this.shortcut = new ShortcutKey('o', true);
        this.showPopup = false;
    }

    newCanvas(confirm: boolean = false): void {
        if (!confirm && NewDrawing.isNotEmpty(this.drawingService.baseCtx, this.drawingService.canvas.width, this.drawingService.canvas.height)) {
            this.showPopup = true;
            return;
        }

        this.toolHandler.getTool().stopDrawing();

        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        const canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        const canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;

        let width: number = (document.documentElement.clientWidth - canvasLeft) / 2;
        let height: number = (document.documentElement.clientHeight - canvasTop) / 2;

        width = Math.max(width, CanvasConst.MIN_WIDTH);
        height = Math.max(height, CanvasConst.MIN_HEIGHT);

        this.drawingService.resizeCanvas(width, height);
        this.drawingService.initBackground();
    }
}
