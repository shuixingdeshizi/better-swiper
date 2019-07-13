
const hasOwn = Object.prototype.hasOwnProperty

class EventBus {
  constructor (events = {}) {
    this.events = {}
  }

  on (event, handler) {
    if (!hasOwn.call(this.events, event)) {
      this.events[event] = []
    }

    var index = this.events[event].push(handler) - 1

    return {
      remove () {
        this.events[event].splice(index, 1)
      }
    }
  }

  emit (event, context) {
    if (!hasOwn.call(this.events, event)) {
      return
    }
    if (this.events[event] && this.events[event].length > 0) {
      this.events[event].forEach(item => {
        item(context || {})
      })
    }
  }
}

export default EventBus
export {
  EventBus
}