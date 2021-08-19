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


module.exports = class pQueue {
  queue = [];
  pendingPromise = false;
  constructor(queue) {
    if (queue != undefined && Array.isArray(queue)) {
      for (job of queue.values) {
        this.enqueue(job)
      }
    }
  }

  /**
   * Add a Promise to this queue
   * @param {promise} promise 
   */
  enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
    });
  }

  dequeue() {
    if (this.workingOnPromise) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      item.promise()
        .then((value) => {
          this.workingOnPromise = false;
          item.resolve(value);
          this.dequeue();
        })
        .catch(err => {
          this.workingOnPromise = false;
          item.reject(err);
          this.dequeue();
        })
    } catch (err) {
      this.workingOnPromise = false;
      item.reject(err);
      this.dequeue();
    }
    return true;
  }

  /**
   *  Check if this task is "Runnable"
   *  returns true if this Queue has tasks and is not currently waiting on a task
   */
  runnable() {
    return ((this.queue.length >= 1) && (!this.workingOnPromise))
  }

  /**
   * Run this Queue
   */
  async run() {
    return this.dequeue();
  }
}