import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { RoomState } from './store/room.state';
import { AuthState } from './store/auth.state';
import { PlayerState } from './store/player.state';
import { ImageState } from './store/image.state';
import { UserState } from './store/user.state';

const appInitFn = (angularAuth: AngularFireAuth) => {
  return () => angularAuth.signInAnonymously();
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxsModule.forRoot([AuthState, UserState]),
    NgxsModule.forFeature([RoomState, PlayerState, ImageState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),

  ],
  providers: [{
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: appInitFn,
    deps: [AngularFireAuth],
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
