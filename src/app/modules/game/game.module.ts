import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { StartComponent } from './components/start/start.component';
import { DrawComponent } from './components/draw/draw.component';
import { WriteComponent } from './components/write/write.component';
import { BookComponent } from './components/book/book.component';
import { FormsModule } from '@angular/forms';
import { DrawingEditorModule } from '../drawing-editor/drawing-editor.module';
import { DrawingEditorComponent } from '../drawing-editor/components/drawing-editor/drawing-editor.component';


@NgModule({
  declarations: [
    StartComponent,
    DrawComponent,
    WriteComponent,
    BookComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    FormsModule,
    DrawingEditorModule
  ]
})
export class GameModule { }
