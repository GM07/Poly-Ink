import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolHandlerService {
    //private TOOLS: Map<String, Tool> = new Map();
    private TOOLS: Array<Tool> = [];
    private currentTool: Tool;

    constructor(pencilService: PencilService) {
        this.TOOLS.push(pencilService);
        this.currentTool = this.TOOLS.values().next().value;
    }

    public getTool(): Tool {
        return this.currentTool;
    }

    public setTool(toolClass: typeof Tool): boolean {
        for (let i = 0; i < this.TOOLS.length; ++i) {
            if (this.TOOLS[i] instanceof toolClass) {
                this.currentTool = this.TOOLS[i];
                return true;
            }
        }

        return false;
    }

    public onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    public onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    public onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    public onKeyPress(event: KeyboardEvent): void {
        let tool = this.findToolshortcutKey(event.key);
        if (tool != undefined) {
            this.currentTool = tool;
        }
    }

    private findToolshortcutKey(key: String): Tool | undefined {
        if (this.currentTool.shortCutKey == key) return undefined;

        for (let i = 0; i < this.TOOLS.length; ++i) {
            if (this.TOOLS[i].shortCutKey == key) {
                return this.TOOLS[i];
            }
        }
        return undefined;
    }
}
