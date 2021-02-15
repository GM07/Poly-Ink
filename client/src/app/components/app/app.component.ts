import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS_PATHS } from '@app/classes/tool_ui_settings/tools.constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        ICONS_PATHS.forEach((iconPath) => {
            this.matIconRegistry.addSvgIcon(iconPath[0], this.domSanitizer.bypassSecurityTrustResourceUrl(iconPath[1]));
        });
    }
}
