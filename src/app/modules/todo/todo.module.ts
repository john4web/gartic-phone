import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodosComponent } from './components/todos/todos.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { TodoState } from 'src/app/store/todo.state';


@NgModule({
  declarations: [
    TodosComponent,
    TodoFormComponent,
    TodoListComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    FormsModule,
    NgxsModule.forFeature([TodoState])
  ]
})
export class TodoModule { }
