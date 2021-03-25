import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { ColorService } from './../../../color-picker/services/color.service';
import { BucketDraw } from './../../classes/commands/bucket-draw';
import { BucketConfig } from './../../classes/tool-config/bucket-config';
import { BucketToolConstants } from './../../classes/tool_ui_settings/tools.constants';
import { MouseButton } from './../../constants/control';
import { DrawingService } from './../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    config: BucketConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(BucketToolConstants.SHORTCUT_KEY);
        this.config = new BucketConfig();
    }

    onMouseDown(event: MouseEvent) {
        if (event.button === MouseButton.Left) this.config.contiguous = true;
        else if (event.button === MouseButton.Right) this.config.contiguous = false;
        else return;

        if (this.isInCanvas(event)) {
            this.config.point = this.getPositionFromMouse(event);
            this.draw();
        }
    }

    draw() {
        const command = new BucketDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
