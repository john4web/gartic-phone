import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { DrawComponent } from './components/draw/draw.component';
import { WriteComponent } from './components/write/write.component';
import { BookComponent } from './components/book/book.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { RoomState } from './store/room.state';
import { FormsModule } from '@angular/forms';

const appInitFn = (angularAuth: AngularFireAuth) => {
  return () => angularAuth.signInAnonymously();
};


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
    DrawComponent,
    WriteComponent,
    BookComponent,
    LobbyComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxsModule.forRoot(),
    NgxsModule.forFeature([RoomState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    FormsModule

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
