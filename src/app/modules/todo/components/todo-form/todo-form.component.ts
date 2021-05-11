import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddTodo } from 'src/app/store/todo.actions';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {

  title = '';
  loading = false;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onSubmit(): void {

    if (this.title) {
      this.loading = true;

      this.store.dispatch(new AddTodo(this.title)).subscribe(() => {
        this.title = '';
        this.loading = false;
      });
    }
  }

}
