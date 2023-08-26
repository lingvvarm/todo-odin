"use strict";

import Project from "./project";

export default class ProjectManager {
    constructor(data=null) {
        if (data) {
            if (data.length == 0) console.log('empty!');
            this.projects = new Array();
            for (let i of data) {
                this.projects.push(new Project(i.name, i.todos));
            }

        }
        else {
            this.projects = new Array();
        }
    }

    checkProject(project_name) {
        let names = this.getProjectNames();
        return names.includes(project_name)
    } 

    append(project) {
        let names = this.getProjectNames();
        if (names.includes(project.name)) {
            alert(`project '${project.name}' already exists`);
            return;
        }
        this.projects.push(project);
    }

    remove(project_name) {
        this.projects.forEach((elem, index) => {
            if (elem.name == project_name) {
                this.projects.splice(index, 1);    
            }
        });
    }

    getProjectNames() {
        return this.projects.map(elem => elem.name);
    }

    getProjectByName(project_name) {
        this.projects.forEach(elem => {
            if (elem.name == project_name) {
                return elem;
            }
        })
    }
}