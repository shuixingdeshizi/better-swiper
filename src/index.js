
import EventBus from './core/event-bus'

import TouchBus from './core/touch-bus'

import { warn } from './utils/debug'

import { extend } from './utils/lang'

class BetterSwiper {
  constructor (el, options = {}) {
    this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
    if (!this.wrapper) {
      warn('Can not resolve this wrapper DOM.')
    }
  
    this.container = this.wrapper.querySelector('.container')
  
    if (!this.container) {
      warn('Can not resolve this container DOM.')
    }


    const DEFAULT_OPTIONS = {
      initialSlide: 0,          // 设置初始化时better-swiper的索引
      direction: 'horizontal',  //  slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
      speed: 300,                // 切换速度,即slider自动滑动开始到结束的时间（单位ms）
      delay: 3000,
      loop: false
    }
    
    this.options = extend({}, DEFAULT_OPTIONS, options)

    if (this.options.loop) {
      this.container.appendChild(this.container.children[0].cloneNode(true))
    }

    this.slides = this.container.children
    this.slidesLength = this.slides.length

    if (this.slidesLength === 0) {
      warn['container is empty']
    }

    this.percentDistance = this.slides[0].offsetWidth


    this.currentIndex = 0
  
    this.events = new EventBus()


    let touchBus = new TouchBus(this.wrapper)

    touchBus.on('touchend', (target) => {
      console.log(target)
      if (target.directX === 'left') {
        // 根据手指滑动的距离移动
        // ...
        // this.slidePrev()
        console.log('切换到上一个')
      } else {
        // this.slideNext()
        console.log('切换到下一个')
      }
    })

    this.init()
  }

  init () {
    let step = ()  => {
      this.slideNext()
      setTimeout(step, this.options.delay)
    }
    setTimeout(step, this.options.delay)
  }

  slideNext () {
    this.currentIndex += 1
    if (this.currentIndex >= this.slidesLength) {
      this.currentIndex = 0
    }
    let cssText = `transform: translateX(-${this.currentIndex * this.percentDistance}px); transition: transform ${this.options.speed}ms ease;`

    if (this.options.loop && this.currentIndex >= this.slidesLength - 1) {
      let handler =  () => {
        this.currentIndex = 0
        this.container.style.cssText = `transform: translateX(-${this.currentIndex * this.percentDistance}px);`
        this.container.removeEventListener('transitionend', handler)
      }
      this.container.addEventListener('transitionend', handler)
    }
    this.container.style.cssText = cssText
    this.events.trigger('slideChange', this.currentIndex)
  }

  slidePrev () {
    console.log('slidePrev')
  }

  on (event, handler) {
    this.events.on(event, handler)
  }

  slide () {

  }

  pause () {
    
  }
}

export default BetterSwiper
