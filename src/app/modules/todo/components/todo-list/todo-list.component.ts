import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TodoInterface, TodoState } from 'src/app/store/todo.state';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  constructor() { }
  @Select(TodoState.todos)

  todos$: Observable<TodoInterface[]>;
  ngOnInit(): void {

  }


  trackById(index: number, todo: TodoInterface): string {
    return todo.id;
  }


}
