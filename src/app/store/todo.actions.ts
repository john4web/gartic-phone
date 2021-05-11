import { TodoInterface } from './todo.state';

export class AddTodo {
  static readonly type = '[Todo] AddTodo';  // string that needs to be unique

  // What things do i need to create a todo element? -> just the title
  constructor(public title: string) { }


}


export class SetTodos {
  static readonly type = '[Todo] SetTodos';

  constructor(public todos: TodoInterface[]) { }

}
