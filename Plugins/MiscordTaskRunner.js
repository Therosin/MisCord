// Copyright (C) 2021 Theros @[MisModding|SvalTek]
// 
// This file is part of MisCord.
// 
// MisCord is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// MisCord is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with MisCord.  If not, see <http://www.gnu.org/licenses/>.

const pQueue = require('../util/pQueue')
const { isBlankString } = require('../util/BotUtils')
const { Task } = require('../Modules/Tasks');

export default class MisCordTaskManager {
    constructor() {
        this.tasks = []
    }

    AddTask(name, method, delay, repeat) {
        if (!name || isBlankString(name)) { return false, "task must have a name" }
        if (!method || typeof (method) !== "function") { return false, "task must have a method function" }

        if (this.tasks.findIndex((p) => { return p.name = name }) >= 0) {
            return false, "task names must be unique"
        }
        const new_task = new Task(name, method, delay, repeat)
        this.tasks.push(new_task)
    }

    DelTask(name) {
        if (!name || isBlankString(name)) { return false, "task must have a name" }

        const taskIndex = this.tasks.findIndex((p) => { return p.name = name })
        if (!taskIndex) {
            return false, "task does not exist"
        }
        const removed_task = this.tasks.splice(taskIndex, 1)
        if (removed_task !== undefined) {
            return true, "task removed"
        } else {
            return false, "failed removing task"
        }
    }
    RunTasks() {
        this.tasks.forEach((task) => {
        })
    }
}

