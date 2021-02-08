import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LineSettings } from '@app/classes/tool_settings/line-settings';
import { LineToolConstants, PencilToolConstants } from '@app/classes/tool_settings/tools.constants';
import { EditorComponent } from '@app/components/editor/editor.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let toolHandlerService: ToolHandlerService;
    let router: Router;

    beforeEach(async(() => {
        const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing'], { toolID: PencilToolConstants.TOOL_ID });
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing'], { toolID: LineToolConstants.TOOL_ID });

        TestBed.configureTestingModule({
            declarations: [SidebarComponent, MatIcon],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                ]),
                NoopAnimationsModule,
                MatTooltipModule,
                MatListModule,
                MatIconModule,
                NoopAnimationsModule,
                MatIconTestingModule,
                MatSidenavModule,
            ],
            providers: [{ provide: PencilService, useValue: pencilSpy }, { provide: LineService, useValue: lineSpy }, ToolHandlerService],
        }).compileComponents();
        router = TestBed.inject(Router);
    }));

    beforeEach(() => {
        // Inject service to test
        toolHandlerService = TestBed.inject(ToolHandlerService);

        // Inject its spy dependecies
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the current tool in toolHandlerService when a tool button is clicked', () => {
        pencilServiceSpy.stopDrawing.and.returnValue();
        lineServiceSpy.stopDrawing.and.returnValue();

        // Default Tool should be Pencil
        expect(toolHandlerService.currentTool.toolID).toEqual(PencilToolConstants.TOOL_ID);
        component.toolIconClicked(new LineSettings());
        expect(toolHandlerService.currentTool.toolID).toEqual(LineToolConstants.TOOL_ID);
    });

    it('should go back to menu', () => {
        const funct = spyOn(router, 'navigateByUrl');
        component.backToMenu();
        expect(funct).toHaveBeenCalledWith('home');
    });
});
