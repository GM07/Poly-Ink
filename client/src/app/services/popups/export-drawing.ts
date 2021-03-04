import { ShortcutKey } from '@app/classes/shortcut-key';

export class ExportDrawing {
    shortcut: ShortcutKey;
    showPopup: boolean;

    constructor() {
        this.showPopup = false;
        this.shortcut = new ShortcutKey('e', true);
    }

    exportImage(image: string, format: string, name: string): void {
        const byteImage = image;

        const downloadElement = document.createElement('a');
        downloadElement.download = name + '.' + format;
        downloadElement.href = byteImage;
        downloadElement.dataset.downloadurl = ['image/' + format, downloadElement.download, downloadElement.href].join(':');
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }
}
