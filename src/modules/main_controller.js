"use strict";

import ScreenController from "./screen_controller";
import ProjectManager from "./project_manager";
import Storage from "./storage";
import Project from "./project";
import ToDo from "./todo";


export default class MainController {
    constructor() {
        this.screen = new ScreenController(this);
        this.current_proj = null;

        let current_date = new Date();
        this.today = this.formatDate(current_date);
        current_date.setDate(current_date.getDate() + 1);
        this.tomorrow = this.formatDate(current_date);

        const stored_data = Storage.get_data();
        
        if (stored_data) {
            this.manager = new ProjectManager(stored_data);
            this.screen.update_projects_list(this.manager.getProjectNames());
            this.refresh_const_lists();
        } else {
            this.manager = new ProjectManager();
            this.appendProject('Demo Project');
            this.appendProject('Learning JS');
            this.appendProject('Today');
            this.appendProject('Tomorrow');
            this.appendProject('Later');
            this.appendTodo('buy bread', this.today, 'Low', 'Demo Project');
            this.appendTodo('wash the dishes', this.today, 'Medium', 'Demo Project');
            this.appendTodo('add features to todo list', this.tomorrow, 'High', 'Learning JS');
            this.screen.update_projects_list(this.manager.getProjectNames());
            this.refresh_const_lists();
        }
    }

    appendProject(project_name) {
        if (!project_name) {
            alert('Project name must not be empty');
            return false;
        }
        let project = new Project(project_name);
        this.manager.append(project);
        this.screen.update_projects_list(this.manager.getProjectNames());
        this.refresh_const_lists();
        Storage.save_data(this.manager.projects);
    }

    removeProject(project_name) {
        this.manager.remove(project_name);
        this.screen.update_projects_list(this.manager.getProjectNames());
        this.refresh_const_lists();
        Storage.save_data(this.manager.projects);
    }

    clearProject(project_name) {
        this.manager.projects.forEach((elem) => {
            if (elem.name == project_name) {
                elem.todos.length = 0;
            }
        });
    }

    appendTodo(title, dueDate, priority, project_name) {
        if (!this.manager.checkProject(project_name)) {
            alert("No such project!");
            return;
        }
        this.manager.projects.forEach((elem) => {
            if (elem.name == project_name) {
                let todo = new ToDo(title, dueDate, priority);
                elem.append(todo);
            }
        });
        Storage.save_data(this.manager.projects);
    }

    removeTodo(todo_name, project_name) {
        if (!this.manager.checkProject(project_name)) {
            alert(`No project with name ${project_name}`);
            return;
        }
        this.manager.projects.forEach((elem) => {
            if (elem.name == project_name) {
                elem.remove(todo_name);
            }
        });
        this.show_todos(project_name);
        this.refresh_const_lists();
        Storage.save_data(this.manager.projects);
    }

    show_todos(project_name) {
        this.manager.projects.forEach((elem) => {
            if (elem.name == project_name) {
                this.screen.list_todos(elem.getTodos());
            }
        });
    }

    sort_todos(todos, key) {
        if (key == 'title') {
          todos.sort((a, b) => { 
            return a.title.localeCompare(b.title) 
          });
        }
        if (key == 'priority') {
          const priorityOrder = {
            'High': 3,
            'Medium': 2,
            'Low': 1
          };
          todos.sort((a, b) => {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          })
        }
        if (key == 'dueDate') {
          todos.sort((a, b) => {
            return (new Date(a.dueDate)) - (new Date(b.dueDate));
          })
        }
      return todos;
    }

    get_todos(project_name) {
        const project = this.manager.projects.find((elem) => elem.name == project_name);
        if (project) {
            return project.todos;
        }
        return [];
    }    

    formatDate(currentDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    refresh_const_lists() {
        this.clearProject('Today');
        this.clearProject('Tomorrow');
        this.clearProject('Later');
        for (let proj of this.manager.projects) {
            for (let todo of proj.todos) {
                if (todo.dueDate == this.today) {
                    this.appendTodo(todo.title, todo.dueDate, todo.priority, 'Today');
                }
                if (todo.dueDate == this.tomorrow) {
                    this.appendTodo(todo.title, todo.dueDate, todo.priority, 'Tomorrow');
                }
                if (todo.dueDate > this.tomorrow) {
                    this.appendTodo(todo.title, todo.dueDate, todo.priority, 'Later');
                }
            }
        }
        Storage.save_data(this.manager.projects);
    }
    

}