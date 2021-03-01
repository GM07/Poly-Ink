import { NgInitControlPointDirective } from './ng-init-control-point.directive';

describe('NgInitControlPointDirective', () => {
    let directive: NgInitControlPointDirective;

    const delay = async (ms: number) => new Promise((result) => setTimeout(result, ms));
    beforeEach(() => {
        directive = new NgInitControlPointDirective();
    });

    it('should create an instance', () => {
        const directiveInit = new NgInitControlPointDirective();
        expect(directiveInit).toBeTruthy();
    });

    it('should emit an event when initialised', async () => {
        spyOn(directive.ngInit, 'emit');
        directive.ngOnInit();
        // tslint:disable-next-line:no-magic-numbers
        await delay(11);
        expect(directive.ngInit.emit).toHaveBeenCalledTimes(1);
    });
});
