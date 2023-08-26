"use strict";

export default class Storage {
    static save_data(data) {
        localStorage.setItem('data', JSON.stringify(data));
    };

    static get_data() {
        let manager = localStorage.getItem('data');
        return JSON.parse(manager);
    } 
}

