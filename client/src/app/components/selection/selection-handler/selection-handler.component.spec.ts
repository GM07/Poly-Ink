import { TestBed } from '@angular/core/testing';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { SelectionHandlerComponent } from './selection-handler.component';

describe('SelectionHandlerComponent', () => {
    let component: SelectionHandlerComponent;
    let toolHandlerSpy: jasmine.SpyObj<ToolHandlerService>;

    beforeEach(() => {
        toolHandlerSpy = jasmine.createSpyObj('ToolHandlerService', ['getCurrentTool']);

        TestBed.configureTestingModule({
            declarations: [SelectionHandlerComponent],
            providers: [{ provide: ToolHandlerService, useValue: toolHandlerSpy }],
        }).compileComponents();
        component = new SelectionHandlerComponent(toolHandlerSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
