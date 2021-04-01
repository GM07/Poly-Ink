import { Injectable } from '@angular/core';
import { SelectionData } from '@app/classes/selection/selection-data';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private readonly COPY: ShortcutKey = new ShortcutKey('c', true);
    private readonly PASTE: ShortcutKey = new ShortcutKey('v', true);
    private readonly CUT: ShortcutKey = new ShortcutKey('x', true);
    private readonly DELETE: ShortcutKey = new ShortcutKey('delete');

    savedConfigs: SelectionConfig | undefined;
    private lastSelectionTool: AbstractSelectionService;
    private wantsToPaste: boolean;
    private isInitialised: boolean;

    readonly INITIALISATION_SIGNAL: Subject<boolean> = new Subject<boolean>();

    constructor(private toolHandler: ToolHandlerService) {
        this.savedConfigs = undefined;
        this.isInitialised = false;
        this.wantsToPaste = false;
        this.initSignal();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.toolHandler.getCurrentTool().leftMouseDown && !event.repeat) {
            if (this.toolHandler.getCurrentTool() instanceof AbstractSelectionService) {
                if (this.COPY.equals(event)) {
                    event.preventDefault();
                    this.copyDrawing();
                } else if (this.CUT.equals(event)) {
                    event.preventDefault();
                    this.cutDrawing();
                } else if (this.DELETE.equals(event)) {
                    this.deleteDrawing();
                }
            }

            if (this.PASTE.equals(event)) {
                event.preventDefault();
                this.pasteDrawing();
            }
        }
    }

    cutDrawing(): void {
        this.copyDrawing();
        this.deleteDrawing();
    }

    copyDrawing(): void {
        this.lastSelectionTool = this.toolHandler.getCurrentTool() as AbstractSelectionService;
        if (this.lastSelectionTool.config.previewSelectionCtx === null) return;

        this.savedConfigs = this.lastSelectionTool.config.clone();
        this.savedConfigs.endCoords = new Vec2(0, 0);
        this.savedConfigs.markedForPaste = true;
        this.savedConfigs.previewSelectionCtx = this.savedConfigs.SELECTION_DATA[SelectionData.PreviewData].getContext(
            '2d',
        ) as CanvasRenderingContext2D;
        this.isInitialised = true;
    }

    deleteDrawing(): void {
        this.lastSelectionTool = this.toolHandler.getCurrentTool() as AbstractSelectionService;
        if (this.lastSelectionTool.config.previewSelectionCtx === null) return;

        this.lastSelectionTool.config.markedForDelete = true;
        this.lastSelectionTool.stopDrawing();
        this.lastSelectionTool.config.markedForDelete = false;
    }

    pasteDrawing(): void {
        if (this.savedConfigs === undefined) return;
        this.toolHandler.getCurrentTool().stopDrawing();

        this.toolHandler.setTool(this.lastSelectionTool.toolID);
        this.lastSelectionTool.initAttribs(this.savedConfigs.clone());
        this.lastSelectionTool.config.previewSelectionCtx = this.lastSelectionTool.config.SELECTION_DATA[SelectionData.PreviewData].getContext(
            '2d',
        ) as CanvasRenderingContext2D;

        if (this.isInitialised) {
            this.lastSelectionTool.updateSelection(new Vec2(0, 0));
        } else {
            this.wantsToPaste = true;
        }
    }

    private initSignal(): void {
        this.INITIALISATION_SIGNAL.subscribe((init: boolean) => {
            if (this.toolHandler.getCurrentTool() === this.lastSelectionTool) {
                if (!this.isInitialised && init && this.wantsToPaste) {
                    this.lastSelectionTool.updateSelection(new Vec2(0, 0));
                    this.wantsToPaste = false;
                    this.isInitialised = init;
                }
                this.isInitialised = init;
            } else {
                this.isInitialised = false;
            }
        });
    }
}
