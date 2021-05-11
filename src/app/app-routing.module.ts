import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { DrawComponent } from './components/draw/draw.component';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StartComponent } from './components/start/start.component';
import { WriteComponent } from './components/write/write.component';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./modules/todo/todo.module').then(m => m.TodoModule)
  },


  /*{
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
  },
  {
    path: 'start',
    component: StartComponent,
  },
  {
    path: 'draw',
    component: DrawComponent,
  },
  {
    path: 'write',
    component: WriteComponent,
  },
  {
    path: 'book',
    component: BookComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
