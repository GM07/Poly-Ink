import { NgInitControlPointDirective } from './ng-init-control-point.directive';

describe('NgInitControlPointDirective', () => {
    let directive: NgInitControlPointDirective;

    const delay = async (ms: number) => new Promise((result) => setTimeout(result, ms));
    beforeEach(() => {
        directive = new NgInitControlPointDirective();
    });

    it('should create an instance', () => {
        const directive = new NgInitControlPointDirective();
        expect(directive).toBeTruthy();
    });

    it('should emit an event when initialised', async () => {
        spyOn(directive.initEvent, 'emit');
        directive.ngOnInit();
        await delay(11);
        expect(directive.initEvent.emit).toHaveBeenCalledTimes(1);
    });
});
