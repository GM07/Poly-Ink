import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon('bucket', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/bucket.svg'));
        this.matIconRegistry.addSvgIcon(
            'ellipse-selection',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/ellipse-selection.svg'),
        );
        this.matIconRegistry.addSvgIcon('ellipse', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/ellipse.svg'));
        this.matIconRegistry.addSvgIcon('eraser', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/eraser.svg'));
        this.matIconRegistry.addSvgIcon('export', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/export.svg'));
        this.matIconRegistry.addSvgIcon('eye-dropper', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/eye-dropper.svg'));
        this.matIconRegistry.addSvgIcon('lasso', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/lasso.svg'));
        this.matIconRegistry.addSvgIcon('line', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/line.svg'));
        this.matIconRegistry.addSvgIcon('polygone', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/polygone.svg'));
        this.matIconRegistry.addSvgIcon(
            'rectangle-selection',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/rectangle-selection.svg'),
        );
        this.matIconRegistry.addSvgIcon('rectangle', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/rectangle'));
        this.matIconRegistry.addSvgIcon('spray', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/spray.svg'));
        this.matIconRegistry.addSvgIcon('stamp', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/stamp.svg'));
        this.matIconRegistry.addSvgIcon('palette', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/palette.svg'));
        this.matIconRegistry.addSvgIcon('save', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/save.svg'));
        this.matIconRegistry.addSvgIcon('text', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/text.svg'));
        this.matIconRegistry.addSvgIcon('palette', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/palette.svg'));
        this.matIconRegistry.addSvgIcon('pencil', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/pencil.svg'));
    }
}
