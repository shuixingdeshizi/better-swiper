import { isArray, arraySlice } from '../utils/index.js'

class EventBus {
    constructor (events = {}) {
        this.events = events
    }
    on (event, handler) {
        if (typeof this.events[event] === 'undefined') {
            this.events[event] = []
        }
        this.events[event].push(handler)

        return {
            remove: () => {
                this.remove(event, handler)
            }
        }
    }
    trigger (event) {
        let args = arraySlice(arguments, 1)
        if (!isArray(event)) {
            event = [event]
        }
        for(let i = 0, l = event.length; i < l; i++) {
            if (!this.events[event[i]]) {
                continue
            }
            this.events[event[i]].forEach(item => {
                item(...args)
            })
        }
    }
    remove (event, handler) {
        if (!this.events[event]) {
            return
        } 

        let events = this.events[event]
        for (let i = 0, l = events.length; i < l; i++) {
            if (events[i] === handler) {
                events.splice(i, 1)
                break
            }
        }
    }
  }
  
  export default EventBus
