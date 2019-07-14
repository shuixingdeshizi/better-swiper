
import EventBus from './event-bus'
import { extend, addEvent, assert } from '../utils/index.js'

class TouchBus {
  /**
   * TouchTarget
   * @param {*} target             -目标元素
   * @param {object} options
   */
  constructor (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el

    if (!this.el) {
      assert('el is not a valid dom')
    }

    this.elRect = this.el.getBoundingClientRect()
    console.log(this.elRect)
    this.events = new EventBus()
    
    const DEFAULT_OPTIONS = {

    }

    this.options = extend({}, DEFAULT_OPTIONS, options)

    this.initData()

    this.init()
  }
  initData () {
    this.startX = null
    this.startY = null
    this.directX = ''
    this.directY = ''
    this.distanceX = 0
    this.distanceY = 0
    this.touchRatioX = 0
    this.touchRatioY= 0
  }
  on (event, handler) {
    this.events.on(event, handler)
  }
  init () {
    let TOUCH_START, 
        TOUCH_MOVE, 
        TOUCH_END

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

    // touchstart 事件监听
    addEvent(this.el, TOUCH_START, (e) => {
      let point = e.touches ? e.touches[0] : e
      this.startX = point.pageX
      this.startY = point.pageY
      this.events.trigger('touchstart', {x: point.pageX, y: point.pageY})

      // touchmove 事件监听
      let removeTouchMove = addEvent(this.el, TOUCH_MOVE, (e) => {
        let point = e.touches ? e.touches[0] : e
        let moveX = point.pageX - this.startX
        let moveY = point.pageY - this. startY

        this.directX = moveX > 0 ? 'right' : 'left'
        this.directY = moveY > 0 ? 'bottom' : 'top'

        this.distanceX = Math.abs(moveX)
        this.distanceY = Math.abs(moveY)

        this.touchRatioX = this.distanceX / this.elRect.width
        this.touchRatioY = this.distanceY / this.elRect.height

        let moveInfo = {
          startX: this.startX,
          startY: this.startY,
          x: point.pageX, 
          y: point.pageY, 
          directX: this.directX,
          directY: this.directY,
          distanceX: this.distanceX,
          distanceY: this.distanceY,
          touchRatioX: this.touchRatioX,
          touchRatioY: this.touchRatioY
        }

        this.events.trigger('touchmove', moveInfo)

        if (moveX > 0) {
          this.events.trigger('touchRight', moveInfo)
        } else {
          this.events.trigger('touchLeft', moveInfo)
        }

        if (moveY > 0) {
          this.events.trigger('touchBottom', moveInfo)
        } else {
          this.events.trigger('touchTop', moveInfo)
        }
      })

      // touchend 事件监听
      let removeTouchEnd = addEvent(this.el, TOUCH_END, (e) => {
        this.events.trigger('touchend')
        removeTouchMove.remove()
        removeTouchEnd.remove()
        
        this.initData()
      })
    })
  }
}

export default TouchBus
