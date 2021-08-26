class pQueue {
  queue = [];
  workingOnPromise = false;
  pendingStop = false;

  constructor(queue) {
      if (queue != undefined && Array.isArray(queue)) {
          for (let job of queue.values()) {
              this.enqueue(job)
          }
      }
  }

  /**
   * Enqueue a Promise for this pQueue
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

  /**
   * Run and dequeue a promise from this pQueue
   * @returns Promise
   */
  async dequeue() {
      if (this.workingOnPromise) {
          return false;
      }
      if (this.pendingStop) {
          this.queue = [];
          this.stop = false;
          return;
      }
      const item = this.queue.shift();
      if (!item) {
          return false;
      }
      try {
          this.workingOnPromise = true;
          await item.promise()
              .then(value => {
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
   *  Check if this pQueue is "Runnable"
   *  returns true if this Queue has tasks and is not currently waiting on a task or a pending stop
   */
  runnable() {
      return ((this.queue.length >= 1) && (!this.workingOnPromise) && (!this.pendingStop))
  }

  /**
   * Run this pQueue
   */
  async run() {
      return await this.dequeue();
  }

  /**
   * Signal to this pQueue to stop, it will stop as soon as the current Promise has compleated
   */
  stop() {
      this.pendingStop = true
  }
}

module.exports = pQueue


//
// ──────────────────────────────────────────────────────────── USAGE EXAMPLE ─────
//

const test = function () {
  function sleep(sleepDuration) {
      var now = new Date().getTime();
      while (new Date().getTime() < now + sleepDuration) { /* Do nothing */ }
  }

  //const pQueue = require('./util/pQueue')
  let queue = new pQueue()
  let results = []

  // queue some promises

  queue.enqueue(() => {

      return new Promise((resolve, reject) => {
          sleep(2000)
          console.log("Promise1")
          resolve("promise 1 ok")
      })
          .then(result => {
              results.push({ "status": "OK", "result": result })
          })

  })

  queue.enqueue(() => {

      return new Promise((resolve, reject) => {
          sleep(1000)
          console.log("Promise2")
          resolve("promise 2 ok")
      })
          .then(result => {
              results.push({ "status": "OK", "result": result })
          })

  })

  //run queue
  queue.run()
      .then(() => {
          console.log("results:")
          console.log(results)
      })
}

//test() //uncomment to run tests