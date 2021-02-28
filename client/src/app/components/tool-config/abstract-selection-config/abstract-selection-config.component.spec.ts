import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionConfigComponent } from './abstract-selection-config.component';

describe('AbstractSelectionConfigComponent', () => {
  let component: AbstractSelectionConfigComponent;
  let fixture: ComponentFixture<AbstractSelectionConfigComponent>;
  let abstractSelectionService: AbstractSelectionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractSelectionConfigComponent ],
      providers: [AbstractSelectionService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractSelectionConfigComponent);
    abstractSelectionService = TestBed.inject(AbstractSelectionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select all should call select all of abstractSelectionService', () => {
    spyOn(abstractSelectionService, 'selectAll');
    component.selectAll();
    expect(abstractSelectionService.selectAll).toHaveBeenCalled();
  })
});
