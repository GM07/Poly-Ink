import { TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { SettingsHandlerComponent } from '@app/components/tool-config/settings-handler/settings-handler.component';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

describe('SettingsHandlerComponent', () => {
    let component: SettingsHandlerComponent;
    let toolHandlerSpy: jasmine.SpyObj<ToolHandlerService>;

    beforeEach(() => {
        toolHandlerSpy = jasmine.createSpyObj('ToolHandlerService', ['getCurrentTool']);

        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent],
            imports: [MatDividerModule],
            providers: [{ provide: ToolHandlerService, useValue: toolHandlerSpy }],
        }).compileComponents();
        component = new SettingsHandlerComponent(toolHandlerSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
