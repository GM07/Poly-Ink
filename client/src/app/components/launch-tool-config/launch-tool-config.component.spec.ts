import { OverlayContainer } from "@angular/cdk/overlay";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from "@angular/material/dialog/testing";
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolConfigComponent } from '../tool-config/tool-config.component';
import { LaunchToolConfigComponent } from './launch-tool-config.component';

let component: LaunchToolConfigComponent;
let fixture: ComponentFixture<LaunchToolConfigComponent>;
let rootLoader: HarnessLoader;
let overlayContainer: OverlayContainer;

describe('LaunchToolConfigComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatDialogModule],
            declarations: [LaunchToolConfigComponent, ToolConfigComponent]
        })

        .overrideModule
        (BrowserDynamicTestingModule, {
            set: {
                entryComponents: [ToolConfigComponent]
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(LaunchToolConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer);
    }));

    afterEach(async() => {
        const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        await Promise.all(dialogs.map(async d => await d.close()));

        overlayContainer.ngOnDestroy();
    })
    /*
    beforeEach(() => {
        fixture = TestBed.createComponent(LaunchToolConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });*/
    it("should open a dialog", async () => {
        component.openDialog();
    
        const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toEqual(1);
    });

    it("should close an open dialog", async () => {
        component.openDialog();
    
        let dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toEqual(1);
    
        await dialogs[0].close();
        dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toEqual(0);
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
