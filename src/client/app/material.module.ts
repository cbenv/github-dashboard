import { DomSanitizer } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  MatIconRegistry,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatTabsModule,
  MatTableModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platform: Object, private overlayContainer: OverlayContainer) {
    if (isPlatformBrowser(this.platform)) {
      overlayContainer.getContainerElement().classList.add('light-theme', 'mat-typography');
      iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('assets/mdi.svg'));
    }
  }

}
