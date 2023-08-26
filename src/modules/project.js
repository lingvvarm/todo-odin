"use strict";

export default class Project {
    constructor(name, todos=null) {
        this.name = name;
        if (todos == null) {
            this.todos = [];
        }
        else {
            this.todos = todos;
        }
    }

    append(todo) {
        let titles = this.todos.map((elem) => elem.title);
        if (titles.includes(todo.title)) {
            return;
        }
        this.todos.push(todo);
    }

    remove(todo_title) {
        this.todos.forEach((elem, index) => {
            if (elem.title == todo_title) {
                this.todos.splice(index, 1);    
            }
        });
    }

    getTodos() {
        return this.todos;
    }
}


