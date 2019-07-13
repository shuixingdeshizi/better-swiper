(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.BetterSwiper = factory());
}(this, (function () { 'use strict';

  const hasOwn = Object.prototype.hasOwnProperty;

  class EventBus {
    constructor (events = {}) {
      this.events = {};
    }

    on (event, handler) {
      if (!hasOwn.call(this.events, event)) {
        this.events[event] = [];
      }

      var index = this.events[event].push(handler) - 1;

      return {
        remove () {
          this.events[event].splice(index, 1);
        }
      }
    }

    emit (event, context) {
      if (!hasOwn.call(this.events, event)) {
        return
      }
      if (this.events[event] && this.events[event].length > 0) {
        this.events[event].forEach(item => {
          item(context || {});
        });
      }
    }
  }

  function warn (msg) {
    console.error(`[BetterScroll warn]: ${msg}`);
  }

  function extend(target, ...reset) {
    for (let i = 0; i < reset.length; i++) {
      let source = reset[i];
      for (let key in source) {
        target[key] = source[key];
      }
    }
    return target
  }

  class BetterSwiper {
    constructor (el, options = {}) {
      this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
      if (!this.wrapper) {
        warn('Can not resolve this wrapper DOM.');
      }
    
      this.container = this.wrapper.querySelector('.container');
    
      if (!this.container) {
        warn('Can not resolve this container DOM.');
      }


      const DEFAULT_OPTIONS = {
        initialSlide: 0,          // 设置初始化时better-swiper的索引
        direction: 'horizontal',  //  slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
        speed: 300,                // 切换速度,即slider自动滑动开始到结束的时间（单位ms）
        delay: 3000,
        loop: false
      };
      
      this.options = extend({}, DEFAULT_OPTIONS, options);

      if (this.options.loop) {
        this.container.appendChild(this.container.children[0].cloneNode(true));
      }

      this.slides = this.container.children;
      this.slidesLength = this.slides.length;

      if (this.slidesLength === 0) ;

      this.percentDistance = this.slides[0].offsetWidth;


      this.currentIndex = 0;
    
      this.events = new EventBus();


      this.init();
    }

    init () {
      let step = ()  => {
        this.slideNext();
        setTimeout(step, this.options.delay);
      };
      setTimeout(step, this.options.delay);
    }

    slideNext () {
      this.currentIndex += 1;
      if (this.currentIndex >= this.slidesLength) {
        this.currentIndex = 0;
      }
      let cssText = `transform: translateX(-${this.currentIndex * this.percentDistance}px); transition: transform ${this.options.speed}ms ease;`;

      if (this.options.loop && this.currentIndex >= this.slidesLength - 1) {
        let handler =  () => {
          this.currentIndex = 0;
          this.container.style.cssText = `transform: translateX(-${this.currentIndex * this.percentDistance}px);`;
          this.container.removeEventListener('transitionend', handler);
        };
        this.container.addEventListener('transitionend', handler);
      }
      this.container.style.cssText = cssText;
      this.events.emit('slideChange', this.currentIndex);
    }

    on (event, handler) {
      this.events.on(event, handler);
    }

    emit (event, context) {
      this.event(event, context);
    }

    slide () {

    }

    pause () {
      
    }
  }

  return BetterSwiper;

})));
