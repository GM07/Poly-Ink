import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolsConstants from '@app/classes/tool_settings/tools.constants';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolHandlerService {
    openColorPicker: boolean = false;
    private TOOLS: Map<string, Tool> = new Map();
    private currentTool: Tool;
    currentToolSubject: Subject<Tool> = new Subject<Tool>();

    constructor(
        pencilService: PencilService,
        lineService: LineService,
        rectangleService: RectangleService,
        ellipseService: EllipseService,
        eraserService: EraserService,
    ) {
        this.TOOLS.set(ToolsConstants.PencilToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.LineToolConstants.TOOL_ID, lineService);
        // this.TOOLS.set(ToolsConstants.AerosolToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.EllipseSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.EllipseToolConstants.TOOL_ID, ellipseService);
        this.TOOLS.set(ToolsConstants.EraserToolConstants.TOOL_ID, eraserService);
        // this.TOOLS.set(ToolsConstants.EyeDropperToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.FillToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.LassoToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.PolygoneToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.RectangleSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.RectangleToolConstants.TOOL_ID, rectangleService);
        // this.TOOLS.set(ToolsConstants.StampToolConstants.TOOL_ID, pencilService);
        // this.TOOLS.set(ToolsConstants.TextToolConstants.TOOL_ID, pencilService);
        this.currentTool = this.TOOLS.values().next().value;
        this.currentToolSubject.next(this.currentTool);
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolId: string): boolean {
        const newCurrentTool: Tool | undefined = this.TOOLS.get(toolId);

        if (newCurrentTool !== undefined && newCurrentTool !== this.currentTool) {
            this.currentTool.stopDrawing();
            this.currentTool = newCurrentTool;
            this.currentToolSubject.next(this.currentTool);
            return true;
        } else {
            return false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.currentTool.onDoubleClick(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
        const tool = this.findToolshortcutKey(event.key.toLocaleLowerCase());
        if (tool != undefined) {
            this.currentTool.stopDrawing();
            this.currentTool = tool;
            this.currentToolSubject.next(tool);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    private findToolshortcutKey(key: string): Tool | undefined {
        if (this.currentTool.shortcutKey === key) return undefined;

        for (const tool of this.TOOLS.values()) {
            if (tool.shortcutKey === key) {
                return tool;
            }
        }
        return undefined;
    }
}
