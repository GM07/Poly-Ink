import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import { BOTTOM_TOOLS } from '@app/classes/tool_ui_settings/index-bottom';
import { TOP_TOOLS } from '@app/classes/tool_ui_settings/index-top';
import { Paste } from '@app/classes/tool_ui_settings/paste-settings';
import { Redo } from '@app/classes/tool_ui_settings/redo-settings';
import { ToolSettings } from '@app/classes/tool_ui_settings/tool-settings';
import { HIGHLIGHTED_COLOR } from '@app/classes/tool_ui_settings/tools.constants';
import { Undo } from '@app/classes/tool_ui_settings/undo-settings';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    readonly HIGHLIGHTED_COLOR: string = HIGHLIGHTED_COLOR;

    topToolsSettings: ToolSettings[];
    bottomToolsSettings: ToolSettings[];

    pasteToolSettings: Paste;

    undoToolSettings: Undo;
    redoToolSettings: Redo;

    blockUndoIcon: boolean;
    blockRedoIcon: boolean;

    selectedTool: Tool;
    @Output() settingClicked: EventEmitter<string>;
    @Input() disableClose: boolean;

    constructor(
        public clipboardService: ClipboardService,
        public toolHandlerService: ToolHandlerService,
        private undoRedoService: UndoRedoService,
        private router: Router,
        private zone: NgZone,
        private cd: ChangeDetectorRef,
    ) {
        this.toolHandlerService = toolHandlerService;
        this.selectedTool = this.toolHandlerService.getCurrentTool();
        this.toolHandlerService.currentToolSubject.subscribe((newTool) => {
            this.selectedTool = newTool;
        });

        this.topToolsSettings = [];
        this.bottomToolsSettings = [];

        this.pasteToolSettings = new Paste();
        this.initUndoRedoService();

        this.settingClicked = new EventEmitter<string>();
    }

    backToMenu(): void {
        this.undoRedoService.reset();
        this.zone.run(() => this.router.navigateByUrl('home'));
    }

    ngOnInit(): void {
        TOP_TOOLS.forEach((setting: ToolSettings) => {
            this.topToolsSettings.push(setting);
        });
        BOTTOM_TOOLS.forEach((setting: ToolSettings) => {
            this.bottomToolsSettings.push(setting);
        });
    }

    toolIconClicked(toolSettings: ToolSettings): void {
        this.toolHandlerService.setTool(toolSettings.TOOL_ID);
    }

    emitClickEvent(toolSettings: ToolSettings): void {
        this.settingClicked.emit(toolSettings.TOOL_ID);
    }

    private initUndoRedoService(): void {
        this.undoToolSettings = new Undo();
        this.redoToolSettings = new Redo();
        this.blockUndoIcon = this.undoRedoService.blockUndoRedo || this.undoRedoService.currentAction < 0;
        this.blockRedoIcon = this.undoRedoService.blockUndoRedo || this.undoRedoService.currentAction >= this.undoRedoService.commands.length - 1;

        this.undoRedoService.BLOCK_UNDO_ICON.subscribe((block: boolean) => {
            if (this.blockUndoIcon !== block) {
                this.blockUndoIcon = block;
                this.cd.detectChanges();
            }
        });

        this.undoRedoService.BLOCK_REDO_ICON.subscribe((block: boolean) => {
            if (this.blockRedoIcon !== block) {
                this.blockRedoIcon = block;
                this.cd.detectChanges();
            }
        });
    }
}
