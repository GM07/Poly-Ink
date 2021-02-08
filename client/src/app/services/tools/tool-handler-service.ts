import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolsConstants from '@app/classes/tool_settings/tools.constants';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolHandlerService {
    private TOOLS: Map<string, Tool> = new Map();
    currentTool: Tool;

    constructor(pencilService: PencilService, lineService: LineService) {
        this.TOOLS.set(ToolsConstants.PencilToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.LineToolConstants.TOOL_ID, lineService);
        this.TOOLS.set(ToolsConstants.AerosolToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.ColorToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.EllipseSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.EllipseToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.EraserToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.ExportFileToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.EyeDropperToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.FillToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.LassoToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.PolygoneToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.RectangleSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.RectangleToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.RectangleToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.SaveFileToolConsants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.StampToolConstants.TOOL_ID, pencilService);
        this.TOOLS.set(ToolsConstants.TextToolConstants.TOOL_ID, pencilService);
        this.currentTool = this.TOOLS.values().next().value;
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolId: string): boolean {
        const newCurrentTool: Tool | undefined = this.TOOLS.get(toolId);

        if (newCurrentTool !== undefined && newCurrentTool !== this.currentTool) {
            this.currentTool.stopDrawing();
            this.currentTool = newCurrentTool;
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
        if (this.currentTool.shortCutKey === key) return undefined;

        for (const tool of this.TOOLS.values()) {
            if (tool.shortCutKey === key) {
                return tool;
            }
        }
        return undefined;
    }
}
