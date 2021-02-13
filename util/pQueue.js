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