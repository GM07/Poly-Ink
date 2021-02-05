import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class ToolHandlerService {
    private TOOLS: Tool[] = [];
    private currentTool: Tool;

    constructor(pencilService: PencilService, lineService: LineService, rectangleService: RectangleService) {
        this.TOOLS.push(pencilService);
        this.TOOLS.push(lineService);
        this.TOOLS.push(rectangleService);
        this.currentTool = this.TOOLS.values().next().value;
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolClass: typeof Tool): boolean {
        for (const tool of this.TOOLS) {
            if (tool !== this.currentTool && tool instanceof toolClass) {
                this.currentTool.stopDrawing();
                this.currentTool = tool;
                return true;
            }
        }
        return false;
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
        } else {
            this.currentTool.onKeyDown(event);
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

        for (const tool of this.TOOLS) {
            if (tool.shortCutKey === key) {
                return tool;
            }
        }
        return undefined;
    }
}
