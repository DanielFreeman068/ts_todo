interface Task{
  id: number;
  text: string;
  completed: boolean;
}

class TodoList {
  private Tasks: Task[]=[]

  //this method takes a parameter of the type Task and adds it to the Tasks array in the class
  //the tasks array is declared as a private property of the class, which means it can only be accessed from within the class
  addTask(todo:Task){
    this.Tasks.push(todo)
  }

  //this method takes a parameter of type number, which represents the id of the taks to be removed
  removeTaskById(id:number){
    this.Tasks = this.Tasks.filter((todo) => todo.id !== id)
  }

  //this method returns the Tasks array
  getTask(){
    return this.Tasks
  }
}

class TodoListUI{
  private todoList: TodoList;

  constructor(todoList:TodoList){
    this.todoList = todoList
  }

  //updates the user interface to display the list of tasks in the todo list object
  displayTasks(){
    const todoListElement = document.getElementById('todo-list')!
    todoListElement.innerHTML = ""

    this.todoList.getTask().forEach((todo) => {
      const todoElement = document.createElement('li')
      todoElement.innerHTML = `
        <input type="checkbox" data-id="${todo.id}" ${todo.completed ? "checked" : ""}/>
        <span>${todo.text}</span>
        <button class="remove-todo" data-id="${todo.id}">Remove</button>
      `

      todoListElement.appendChild(todoElement)
    })

    // add event listeners to checkboxes to update the tasks completed status
    const checkboxes = todoListElement.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const input = event.target as HTMLInputElement;
        const id = parseInt(input.getAttribute('data-id')!);
        this.todoList.getTask().forEach((task) => {
          if(task.id === id) {
            task.completed = input.checked;
          }
        })
      })
    })
  }

  //this method adds a new taks to the todolist object and updates the user interface to display it
  addTodo(){
    const newTodoInput = document.getElementById("new-todo") as HTMLInputElement
    const newTodoText = newTodoInput.value.trim()

    if(newTodoText){
      const newTodo: Task = {
        id:Date.now(),
        text:newTodoText,
        completed: false,
      }

      this.todoList.addTask(newTodo)
      this.displayTasks()
      newTodoInput.value=""
    }
  }

  // this method removes a task with a specific id from the TodoList object and updates the user interface to reflect the change
  removeTodoById(id:number){
    this.todoList.removeTaskById(id)
    this.displayTasks()
  }

  //event listener to the html elements in the user interface to respond to user interactions
  bindEvents(){
    document
      .getElementById("add-todo")!
      .addEventListener("click", () => this.addTodo())
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement
      if(target.matches(".remove-todo")){
        const id = parseInt(target.getAttribute("data-id")!)
        this.removeTodoById(id)
      }
    })
  }
}

const todoList = new TodoList()
const ui = new TodoListUI(todoList)

ui.displayTasks()
ui.bindEvents()
