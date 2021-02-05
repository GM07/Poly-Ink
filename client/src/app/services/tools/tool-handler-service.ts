import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolHandlerService {
    private TOOLS: Tool[] = [];
    private currentTool: Tool;

    constructor(pencilService: PencilService, lineService: LineService, ellipseService: EllipseService) {
        this.TOOLS.push(pencilService);
        this.TOOLS.push(lineService);
        this.TOOLS.push(ellipseService);
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

    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    onKeyPress(event: KeyboardEvent): void {
        this.currentTool.onKeyPress(event);
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

        for (const tool of this.TOOLS) {
            if (tool.shortCutKey === key) {
                return tool;
            }
        }
        return undefined;
    }
}
