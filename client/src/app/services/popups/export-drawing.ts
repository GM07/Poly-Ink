import { ShortcutKey } from "@app/classes/shortcut-key";
import { DrawingService } from "../drawing/drawing.service";


export class ExportDrawing {

    shortcut: ShortcutKey;
    showPopup: boolean;

    constructor(private drawingService: DrawingService) {
        this.showPopup = false;
        this.shortcut = new ShortcutKey('e', true);
    }

    getImage(): void {
        let image: string = this.drawingService.canvas.toDataURL('image/png');
        window.location.href = image;
    }

    exportImage(canvas: HTMLCanvasElement, format: string, name: string): void {
        
        let image = canvas.toDataURL('image/' + format).replace('image/' + format, 'image/octet-stream');
        
        let downloadElement = document.createElement('a');
        downloadElement.download = name + '.' + format;
        downloadElement.href = image;
        downloadElement.dataset.downloadurl = ['image/' + format, downloadElement.download, downloadElement.href].join(':');
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }


}