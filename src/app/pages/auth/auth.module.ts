import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutModule } from '../../layout/layout.module';

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule
  ],
  exports: [
    LoginComponent
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
