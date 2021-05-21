import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NotFoundComponent,
    HomeComponent,
    LobbyComponent
  ],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    FormsModule
  ]
})
export class LobbyModule { }
