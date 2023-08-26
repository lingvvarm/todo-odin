"use strict";

export default class ScreenController {
    constructor(main_controller) {
        this.projects_block = document.querySelector(".projects-block");
        this.todos_div = document.querySelector(".todos");
        this.new_project_btn = document.querySelector('.add-project-btn');
        this.sidebar = document.querySelector('.sidebar');
        this.project_header = document.querySelector('.content-header');
        this.main_controller = main_controller;
        this.new_task_btn = document.querySelector('.new-task-btn');
        this.content_block = document.querySelector('.content-block');
        this.todo_list_block = document.querySelector('.content-todo-list');
        this.sort = document.querySelector('.sort-list');
    }

    init() {
        this.new_project_btn.addEventListener('click', () => {
            this.create_new_project_form();
        });

        this.update_projects_list(this.main_controller.manager.getProjectNames());

        let projects = document.querySelectorAll('.project-btn');
        projects.forEach((project) => project.addEventListener('click', () => {
            this.choose_project(project.textContent);
        }))

        this.new_task_btn.addEventListener('click', () => {
            this.create_new_todo_form();
            this.new_task_btn.remove();
        });

        this.choose_project('Today');
        this.main_controller.refresh_const_lists();
        
        this.sort.addEventListener('change', () => {
            let todos_unsorted = this.main_controller.get_todos(this.main_controller.current_proj);
            let key = this.sort.value;
            let sorted_todos = this.main_controller.sort_todos(todos_unsorted, key);
            this.list_todos(sorted_todos)
        });
    }

    create_new_project_form() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        input.type = 'text';
        input.classList.add('add-project-input');
        let btns_block = document.createElement('div');
        btns_block.classList.add('create-project-btns');
        let create_btn = document.createElement('button');
        create_btn.className = 'create-project-btn confirm';
        create_btn.textContent = 'Create';
        let cancel_btn = document.createElement('button');
        cancel_btn.className = 'create-project-btn cancel';
        cancel_btn.type = 'button';
        cancel_btn.textContent = 'Cancel';
        form.appendChild(input);
        form.appendChild(btns_block);
        btns_block.appendChild(create_btn);
        btns_block.appendChild(cancel_btn);

        cancel_btn.addEventListener('click', () => {
            form.remove();
            this.new_project_btn.classList.toggle('hidden');
        });

        create_btn.addEventListener('click', (e) => {
            e.preventDefault();
            let name = input.value;
            if (name.length > 10) {
                alert("This name is too long.");
                return;
            }
            let res = this.main_controller.appendProject(name);
            if (res == false) return;
            form.remove();
            this.new_project_btn.classList.toggle('hidden');
        })

        this.sidebar.insertBefore(form, this.new_project_btn);
        this.new_project_btn.classList.toggle('hidden');
    }

    create_new_todo_form() {
        let form = document.createElement('form');
            form.className = 'todo-form';
            let array = ["Prority", "High", "Medium", "Low"];

            let selectList = document.createElement("select");
            selectList.name = 'priority';
            selectList.className = 'todo-priority-input';
            for (let i = 0; i < array.length; i++) {
                let option = document.createElement("option");
                option.value = array[i];
                option.text = array[i];
                if (i == 0) {
                    option.value = "";
                    option.selected = true;
                    option.disabled = true;
                }
                selectList.appendChild(option);
            }
            
            let title_input = document.createElement('input');
            title_input.type = 'text';
            title_input.name = 'title';
            title_input.className = 'todo-title-input';
            title_input.placeholder = 'some very difficult task';

            let date_input = document.createElement('input');
            date_input.type = 'date';
            date_input.name = "dueDate";
            date_input.className = 'todo-date-input';
            date_input.value = this.main_controller.today;

            let ok_btn = document.createElement('button');
            ok_btn.className = 'todo-input-button';

            let ok_img = document.createElement('img');
            ok_img.src = 'img/ok.svg';
            ok_img.className = 'todo-input-button-img';
            ok_btn.appendChild(ok_img);

            let cancel_btn = document.createElement('button');
            cancel_btn.className = 'todo-input-button';

            let cancel_img = document.createElement('img');
            cancel_img.src = 'img/close.svg';
            cancel_img.className = 'todo-input-button-img';
            cancel_btn.appendChild(cancel_img);


            ok_btn.addEventListener('click', (e) => {
                e.preventDefault();
                let priority = selectList.value;
                let title = title_input.value;
                let dueDate = date_input.value;
                if (!priority || !title || !dueDate) {
                    alert('Enter correct data');
                    return;
                }
                this.main_controller.appendTodo(title, dueDate, priority, this.main_controller.current_proj);
                this.main_controller.show_todos(this.main_controller.current_proj);
                form.reset();
                form.remove();
                this.content_block.appendChild(this.new_task_btn);
                this.main_controller.refresh_const_lists();
            });

            cancel_btn.addEventListener('click', () => {
                form.reset();
                form.remove();
                this.content_block.appendChild(this.new_task_btn);
                this.main_controller.refresh_const_lists();
            });

            form.appendChild(selectList);
            form.appendChild(title_input);
            form.appendChild(date_input);
            form.appendChild(ok_btn);
            form.appendChild(cancel_btn);

            this.content_block.appendChild(form);
    }

    update_projects_list(projects) {
        this.projects_block.replaceChildren();
        for (let project of projects) {
            if (['Today', 'Tomorrow', 'Later'].includes(project)) continue;
            let button = document.createElement('button');
            button.classList.add('project-btn');
            let image = document.createElement('img');
            image.classList.add('sidebar-icon');
            image.src = 'img/checklist.svg';
            image.alt = 'project-icon';
            let text = document.createElement('span');
            text.textContent = project;
            button.appendChild(image);
            button.appendChild(text);

            const delete_btn = document.createElement('input');
                delete_btn.type = 'image';
                delete_btn.src = "img/close.svg";
                delete_btn.classList.add('delete-project-btn');

            delete_btn.addEventListener('click', () => {
                this.main_controller.removeProject(project);
            })

            button.addEventListener('click', () => {
                this.choose_project(button.textContent);
            });

            button.addEventListener('mouseenter', () => {
                button.appendChild(delete_btn);
            });

            button.addEventListener('mouseleave', () => {
                delete_btn.remove();
            });


            this.projects_block.appendChild(button);
        }
    }

    list_todos(todos) {
        this.sort.classList.remove('hidden');
        if (todos.length == 0) {
            this.sort.classList.add('hidden');
        }

        this.todo_list_block.replaceChildren();
        for (let todo of todos) {
            let item = document.createElement('div');
            item.className = 'list-item';

            let left = document.createElement('div');
            left.className = 'left-side';

            let check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'item-complete-btn';


            check.addEventListener('click', () => {
                item.classList.toggle('completed');
            });


            left.appendChild(check);

            let p = document.createElement('p');
            p.className = 'item-text';
            p.textContent = todo.title;

            if (!['Today', 'Tomorrow', 'Later'].includes(this.main_controller.current_proj)) {
                let edit_title = document.createElement('input');
                edit_title.type = 'text';
                edit_title.value = todo.title;
                p.addEventListener('click', () => {
                    p.replaceWith(edit_title);

                    window.addEventListener('keydown', (e) => {
                        if (e.code == 'Enter') {
                            this.main_controller.removeTodo(todo.title, this.main_controller.current_proj);
                            this.main_controller.appendTodo(edit_title.value, todo.dueDate, todo.priority, this.main_controller.current_proj);
                            this.main_controller.show_todos(this.main_controller.current_proj);
                            this.main_controller.refresh_const_lists();
                        }
                    });
                });
            }

            left.appendChild(p);

            let right = document.createElement('div');
            right.className = 'right-side';

            let p_date = document.createElement('p');
            p_date.className = 'item-duedate';
            p_date.textContent = todo.dueDate;

            if (!['Today', 'Tomorrow', 'Later'].includes(this.main_controller.current_proj)) {
                let edit_date = document.createElement('input');
                edit_date.type = 'date';
                edit_date.value = todo.dueDate;
                p_date.addEventListener('click', () => {
                    p_date.replaceWith(edit_date);
                    window.addEventListener('change', (e) => {
                        this.main_controller.removeTodo(todo.title, this.main_controller.current_proj);
                        this.main_controller.appendTodo(todo.title, edit_date.value, todo.priority, this.main_controller.current_proj);
                        this.main_controller.show_todos(this.main_controller.current_proj);
                        this.main_controller.refresh_const_lists();
                    })
                })
            }


            right.appendChild(p_date);
            
            const delete_btn = document.createElement('input');
                delete_btn.type = 'image';
                delete_btn.src = "img/close.svg";
                delete_btn.classList.add('delete-project-btn');
                delete_btn.classList.add('todo-delete-btn');
            
            delete_btn.addEventListener('click', () => {
                this.main_controller.removeTodo(todo.title, this.main_controller.current_proj);
            })
            
            item.addEventListener('mouseenter', () => {
                item.classList.add('todo-hover');
                if (!['Today', 'Tomorrow', 'Later'].includes(this.main_controller.current_proj)) right.appendChild(delete_btn);
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('todo-hover');
                delete_btn.remove();
            });

            item.appendChild(left);
            item.appendChild(right);
            if (todo.priority == 'High') item.classList.add('high-priority');
            if (todo.priority == 'Medium') item.classList.add('medium-priority');
            if (todo.priority == 'Low') item.classList.add('low-priority');
            this.todo_list_block.appendChild(item);
        }
    }

    choose_project(project_name) {
        project_name = project_name.trim();
        this.new_task_btn.classList.remove('hidden');
        if (['Today', 'Tomorrow', 'Later'].includes(project_name)) this.new_task_btn.classList.add('hidden');
        this.sort.selectedIndex = 0;
        this.main_controller.current_proj = project_name;
        this.project_header.textContent = project_name;
        this.main_controller.show_todos(this.main_controller.current_proj);
    }

}