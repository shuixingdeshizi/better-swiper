class TouchBus {
  /**
   * TouchTarget
   * @param {*} target             -目标元素
   * @param {object} options
   * @param {*} options.direction  -监听的方向 默认 vertical（垂直方向） 可选 horizontal (水平方向)
   * @param {*} options.distanceX  -水平方向触发的距离
   * @param {*} options.distanceY  -垂直方向触发的距离
   */
  constructor (target, options) {
    this.target = typeof target !== 'object' ? document.querySelector(target) : target
    
    const DEFAULT_OPTIONS = {
      direction: 'vertical'
    }

    this.options = Object.assign({}, DEFAULT_OPTIONS, options)

    this.eventTarget = new EventTarget()

    this.hasFired = false           // 是否已经触发
    this.startX = null
    this.startY = null
    this.movedX = 0
    this.movedY = 0

    this.init()
  }
  init () {
    let {target, direction, eventTarget} = this
    let TOUCH_START, TOUCH_MOVE, TOUCH_END

    let that = this
    if ('ontouchstart' in window) {
      TOUCH_START = 'touchstart'
      TOUCH_MOVE = 'touchmove'
      TOUCH_END = 'touchend'
    } else {
      TOUCH_START = 'mousedown'
      TOUCH_MOVE = 'mousemove'
      TOUCH_END = 'mouseup'
    }
    target.addEventListener(TOUCH_START, startHandler)

    // touchstart/mousestart 触发事件
    function startHandler (e) {
      let point = e.touches ? e.touches[0] : e
      that.startX = point.pageX
      that.startY = point.pageY
      eventTarget.fire('touchstart')
      target.addEventListener(TOUCH_MOVE, moveHandler)
      target.addEventListener(TOUCH_END, endHandler)
    }

    // touchmove/mousemove 触发事件
    function moveHandler (e) {
      let { startX, startY, distanceX = 0, distanceY = 0, hasFired } = that
      let point = e.touches ? e.touches[0] : e
      let movedX = point.pageX - startX
      let movedY = point.pageY - startY

      this.movedX = movedX
      this.movedY = movedY

      eventTarget.fire('touchmove')

      if (hasFired) {
        return false
      } else {
        that.hasFired = true
      }

      if (direction === 'horizotal' && Math.abs(movedX) > distanceX) {
        if (movedX > 0) {
          eventTarget.fire('touchright')
        } else {
          eventTarget.fire('touchleft')
        }
      } else if (Math.abs(movedY) > distanceY) {
        if (movedY > 0) {
          eventTarget.fire('touchdown')
        } else {
          eventTarget.fire('touchup')
        }
      }
    }

    // touchend/mouseend 触发事件
    function endHandler () {
      eventTarget.fire('touchend')
      target.removeEventListener(TOUCH_MOVE, moveHandler)
      target.removeEventListener(TOUCH_END, endHandler)
      
      that.hasFired = false
      that.startX = null
      that.startY = null
      that.movedX = 0
      that.movedY = 0
    }
  }
  on (type, handler) {
    this.eventTarget.addHandler(type, handler)
  }
  off (type, handler) {
    this.event.removeHandler(type, handler)
  }
}

class EventTarget {
  constructor () {
    this.handlers = {}
  }
  addHandler (type, handler) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = []
    }
    this.handlers[type].push(handler)
  }
  removeHandler (type, handler) {
    if (this.handlers[type] instanceof Array) {
      let handlers = this.handlers[type]
      for (let i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1)
          break
        }
      }
    }
  }
  fire (type) {
    if (this.handlers[type] instanceof Array) {
      let handlers = this.handlers[type]
      for (let i = 0, len = handlers.length; i < len; i++) {
        handlers[i]()
      }
    }
  }
}
export default TouchBus
export {
  TouchBus
}
