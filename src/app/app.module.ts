import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthGuard } from './_core/guards/auth.guard';
import { SharedService } from './_core/services/shared.service';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './layout/layout.module';
import { AuthModule } from './pages/auth/auth.module';
import { ProfileModule } from './pages/profile/profile.module';
import { UsersModule } from './pages/users/users.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    LayoutModule,
    AuthModule,
    ProfileModule,
    UsersModule
  ],
  providers: [AuthGuard, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
