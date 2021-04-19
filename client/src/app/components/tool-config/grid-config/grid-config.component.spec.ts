import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { GridService } from '@app/services/drawing/grid.service';
import { GridConfigComponent } from './grid-config.component';

describe('GridConfigComponent', () => {
    let component: GridConfigComponent;
    let fixture: ComponentFixture<GridConfigComponent>;
    let loader: HarnessLoader;
    let gridService: GridService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GridConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        gridService = new GridService();
        gridService = TestBed.inject(GridService);
        fixture = TestBed.createComponent(GridConfigComponent);
        component = fixture.componentInstance;
        gridService.gridVisibility = true;
        fixture.detectChanges();
        spyOn(gridService, 'updateGrid');
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load all slider harnesses', async () => {
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        expect(sliders.length).toBe(2);
    });

    it('should get default value of size slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getValue()).toBe(ToolSettingsConst.GRID_MIN_SIZE);
    });

    it('should get default value of opacity slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        // tslint:disable-next-line:no-magic-numbers
        expect(await slider[1].getValue()).toBe(50);
    });

    it('should get max value of size slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getMaxValue()).toBe(ToolSettingsConst.GRID_MAX_SIZE);
    });

    it('should get max value of opacity slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[1].getMaxValue()).toBe(component.MAX_TRANSPARENCY);
    });

    it('should be able to set value of size slider', async () => {
        const setValue = 50;
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getValue()).toBe(ToolSettingsConst.GRID_MIN_SIZE);

        await slider[0].setValue(setValue);

        expect(await slider[0].getValue()).toBe(setValue);
    });

    it('should be able to set value of opacity slider', async () => {
        const setValue = 55;
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        // tslint:disable-next-line:no-magic-numbers
        expect(await slider[1].getValue()).toBe(50);

        await slider[1].setValue(setValue);

        expect(await slider[1].getValue()).toBe(setValue);
    });

    it('should should change size on slider changer', () => {
        component.sizeChange({ value: ToolSettingsConst.GRID_MAX_SIZE } as MatSliderChange);
        expect(component.gridService.sizeValue).toBe(ToolSettingsConst.GRID_MAX_SIZE);
    });

    it('should should change opacity on slider changer', () => {
        component.opacityChange({ value: ToolSettingsConst.GRID_MAX_OPACITY * ToolMath.PERCENTAGE } as MatSliderChange);
        // tslint:disable-next-line:no-string-literal
        expect(component.gridService['opacity']).toBe(ToolSettingsConst.GRID_MAX_OPACITY);
    });
});
