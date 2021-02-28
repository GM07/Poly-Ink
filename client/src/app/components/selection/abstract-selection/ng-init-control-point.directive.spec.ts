import { NgInitControlPointDirective } from './ng-init-control-point.directive';

describe('NgInitControlPointDirective', () => {
  it('should create an instance', () => {
    const directive = new NgInitControlPointDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit', () => {
    const directive = new NgInitControlPointDirective();
    spyOn(directive.initEvent, 'emit');
    jasmine.clock().install();
    directive.ngOnInit();
    jasmine.clock().tick(15);
    expect(directive.initEvent.emit).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });
});
