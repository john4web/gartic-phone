import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { DrawComponent } from './components/draw/draw.component';
import { StartComponent } from './components/start/start.component';
import { WriteComponent } from './components/write/write.component';

const routes: Routes = [

  {
    path: '',
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




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
