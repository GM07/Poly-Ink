import { Type } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

export class TabHandler<TabComponentClass> {
    private readonly TAB_LIST: Map<string, Type<TabComponentClass>> = new Map();

    constructor(private toolHandler: ToolHandlerService) {}

    setTab(tabId: string, tabComponent: Type<TabComponentClass>): void {
        this.TAB_LIST.set(tabId, tabComponent);
    }

    get activeTab(): Type<TabComponentClass> | undefined {
        return this.TAB_LIST.get(this.toolHandler.getCurrentTool().toolID);
    }
}
