import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
//import { ToolHandlerService } from '@app/services/tools/tool-handler-service';

import { SettingsHandlerComponent } from './settings-handler.component';
import { Tool } from '@app/classes/tool';
//import { ToolConfig } from '../tool-config';
//import { PencilConfigComponent } from '../pencil-config/pencil-config.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//import { PencilConfigComponent } from '../pencil-config/pencil-config.component';
//import { PencilService } from '@app/services/tools/pencil-service';
//import { LineService } from '@app/services/tools/line-service';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
//import { ToolConfig } from '../tool-config';

describe('SettingsHandlerComponent', () => {
    let component: SettingsHandlerComponent;
    let fixture: ComponentFixture<SettingsHandlerComponent>;
    //let pencilService: PencilService;
    //let lineService: LineService;
    //let toolConfig: ToolConfig;
    //let toolHandlerService: ToolHandlerService;

    /*
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent],
            imports: [NoopAnimationsModule]
        }).compileComponents();
    }));*/

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent],
            imports: [NoopAnimationsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(SettingsHandlerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        //pencilService = TestBed.inject(PencilService);
        //lineService = TestBed.inject(LineService);
        //toolHandlerService = TestBed.inject(ToolHandlerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lastTool should be of type Tool', () => {
        expect(component.lastTool).toBeInstanceOf(Tool);
    });

    it('lastTab should be of type ToolConfig', () => {
    })
});
