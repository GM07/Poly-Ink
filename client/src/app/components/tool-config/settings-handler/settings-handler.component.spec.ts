import { TestBed } from '@angular/core/testing';
//import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
//import { ToolHandlerService } from '@app/services/tools/tool-handler-service';

import { SettingsHandlerComponent } from './settings-handler.component';
//import { ToolConfig } from '../tool-config';
import { PencilConfigComponent } from '../pencil-config/pencil-config.component';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
//import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Tool } from '@app/classes/tool';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { LineService } from '@app/services/tools/line-service';


class MockToolHandler extends ToolHandlerService {
    //TOOLS: Tool[] = [];
    //currentTool: Tool;

    constructor(pencilService: PencilService, lineService: LineService) {
        super(pencilService, lineService);
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolClass: typeof Tool): boolean {
        for (const tool of this.TOOLS) {
            if (tool !== this.currentTool && tool instanceof toolClass) {
                //this.currentTool.stopDrawing();
                this.currentTool = tool;
                return true;
            }
        }
        return false;
    }
}

describe('SettingsHandlerComponent', () => {
    let component: SettingsHandlerComponent;
    //let fixture: ComponentFixture<SettingsHandlerComponent>; 
    let pencilService: PencilService;
    let lineService: LineService;
    let toolHandlerService: MockToolHandler;

    beforeEach(() => { 
        pencilService = TestBed.inject(PencilService);
        lineService = TestBed.inject(LineService);
        toolHandlerService = new MockToolHandler(pencilService, lineService);
        component = new SettingsHandlerComponent(toolHandlerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lastTool should be of type Tool', () => {
        expect(component.lastTool).toBeInstanceOf(Tool);
    });

    it('lastTab should be a PencilConfigComponent as default', () => {
        expect(component.lastTab === PencilConfigComponent).toBeTruthy();
    });

    it('activeTab should be a the display of the current tool', () => {
        if (toolHandlerService.getTool() instanceof PencilService)
          expect(component.activeTab === PencilConfigComponent).toBeTruthy();
        if (toolHandlerService.getTool() instanceof LineService) 
            expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });

    it('should change the return value of activeTab for LineConfigComponent when setTool(LineService is called', () => {
        toolHandlerService.setTool(LineService);
        expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });
});

/*
describe('SettingsHandlerComponent', () => {
    
    let component: SettingsHandlerComponent;
    let fixture: ComponentFixture<SettingsHandlerComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let toolHandlerService: ToolHandlerService;

    beforeEach(() => { *///*****ECQ L'ERREUR VIENT DU SPY OBJ?? */
       /* const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing']);
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing']);

        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent],
            imports: [NoopAnimationsModule],
            providers: [ToolHandlerService, 
                {provide: PencilService, useValue: pencilSpy}, 
                {provide: LineService, useValue: lineSpy}]
        }).compileComponents();
        toolHandlerService = TestBed.inject(ToolHandlerService);

        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;

        fixture = TestBed.createComponent(SettingsHandlerComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });*/
/*
    it('lastTool should be of type Tool', () => {
        expect(component.lastTool).toBeInstanceOf(Tool);
    });

    it('lastTab should be a PencilConfigComponent as default', () => {
        expect(component.lastTab === PencilConfigComponent).toBeTruthy();
    });*/
/*
    it('activeTab should be a the display of the current tool', () => {
        if (toolHandlerService.getTool() instanceof PencilService)
          expect(component.activeTab === PencilConfigComponent).toBeTruthy();
        if (toolHandlerService.getTool() instanceof LineService) 
            expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });*/
/*
    it('should', () => {
        pencilServiceSpy.stopDrawing.and.callFake;
        lineServiceSpy.stopDrawing.and.callFake;

        console.log(toolHandlerService.getTool());

        toolHandlerService.setTool(LineService);
        expect(component.lastTab === LineConfigComponent);
    });
});*/


    /*
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent],
            imports: [NoopAnimationsModule]
        }).compileComponents();
    }));*/

