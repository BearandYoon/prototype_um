import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WordmarkComponent } from './wordmark/wordmark.component';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [HeaderComponent, FooterComponent, WordmarkComponent, LogoComponent],
  exports: [
    FooterComponent,
    HeaderComponent,
    WordmarkComponent,
    LogoComponent
  ]
})
export class LayoutModule { }
