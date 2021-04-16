import { Injectable } from '@angular/core';
import { BucketDraw } from '@app/classes/commands/bucket-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { BucketConfig } from '@app/classes/tool-config/bucket-config';
import { BucketToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    config: BucketConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(BucketToolConstants.SHORTCUT_KEY);
        this.config = new BucketConfig();
        this.toolID = BucketToolConstants.TOOL_ID;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Left) this.config.contiguous = true;
        else if (event.button === MouseButton.Right) this.config.contiguous = false;
        else return;

        this.config.point = this.getPositionFromMouse(event);
        this.draw();
    }

    draw(): void {
        const command = new BucketDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
