(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.BetterSwiper = factory());
}(this, (function () { 'use strict';

  const objectToString = Object.prototype.toString;


  const isArray = (v) => {
    return objectToString.call(v).slice(8, -1) === 'Array'
  }; 

  const arraySlice = (v, start, end) => {
    return Array.prototype.slice.call(v, start, end)
  };

  const extend = (target, ...reset) => {
    for (let i = 0, l = reset.length; i < l; i++) {
      let source = reset[i];
      for (let key in source) {
        target[key] = source[key];
      }
    }

    return target
  };

  const assert = (msg) => {
    console.log(`[touch-bus]warn:${msg}`);
  };


  const removeEvent = (target, event, handler) => {
    target.removeEventListener(event, handler);
  };

  const addEvent = (target, event, handler) => {
    if (!target || !target.nodeType) {
      console.log(target);
    }
    target.addEventListener(event, handler);
    return {
      remove () {
        removeEvent(target, event, handler);
      }
    }
  };

  class EventBus {
      constructor (events = {}) {
          this.events = events;
      }
      on (event, handler) {
          if (typeof this.events[event] === 'undefined') {
              this.events[event] = [];
          }
          this.events[event].push(handler);

          return {
              remove: () => {
                  this.remove(event, handler);
              }
          }
      }
      trigger (event) {
          let args = arraySlice(arguments, 1);
          if (!isArray(event)) {
              event = [event];
          }
          for(let i = 0, l = event.length; i < l; i++) {
              if (!this.events[event[i]]) {
                  continue
              }
              this.events[event[i]].forEach(item => {
                  item(...args);
              });
          }
      }
      remove (event, handler) {
          if (!this.events[type]) {
              return
          } 

          let events = this.events[event];
          for (let i = 0, l = events.length; i < l; i++) {
              if (events[i] === handler) {
                  events.splice(i, 1);
                  break
              }
          }
      }
    }

  class TouchBus {
    /**
     * TouchTarget
     * @param {*} target             -目标元素
     * @param {object} options
     */
    constructor (el, options) {
      this.el = typeof el === 'string' ? document.querySelector(el) : el;

      if (!this.el) {
        assert('el is not a valid dom');
      }

      this.elRect = this.el.getBoundingClientRect();
      console.log(this.elRect);
      this.events = new EventBus();
      
      const DEFAULT_OPTIONS = {

      };

      this.options = extend({}, DEFAULT_OPTIONS, options);

      this.initData();

      this.init();
    }
    initData () {
      this.startX = null;
      this.startY = null;
      this.directX = '';
      this.directY = '';
      this.distanceX = 0;
      this.distanceY = 0;
      this.touchRatioX = 0;
      this.touchRatioY= 0;
    }
    on (event, handler) {
      this.events.on(event, handler);
    }
    init () {
      let TOUCH_START, 
          TOUCH_MOVE, 
          TOUCH_END;
      if ('ontouchstart' in window) {
        TOUCH_START = 'touchstart';
        TOUCH_MOVE = 'touchmove';
        TOUCH_END = 'touchend';
      } else {
        TOUCH_START = 'mousedown';
        TOUCH_MOVE = 'mousemove';
        TOUCH_END = 'mouseup';
      }

      // touchstart 事件监听
      addEvent(this.el, TOUCH_START, (e) => {
        let point = e.touches ? e.touches[0] : e;
        this.startX = point.pageX;
        this.startY = point.pageY;
        this.events.trigger('touchstart', {x: point.pageX, y: point.pageY});

        // touchmove 事件监听
        let removeTouchMove = addEvent(this.el, TOUCH_MOVE, (e) => {
          let point = e.touches ? e.touches[0] : e;
          let moveX = point.pageX - this.startX;
          let moveY = point.pageY - this. startY;

          this.directX = moveX > 0 ? 'right' : 'left';
          this.directY = moveY > 0 ? 'bottom' : 'top';

          this.distanceX = Math.abs(moveX);
          this.distanceY = Math.abs(moveY);

          this.touchRatioX = this.distanceX / this.elRect.width;
          this.touchRatioY = this.distanceY / this.elRect.height;

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
          };

          this.events.trigger('touchmove', moveInfo);

          if (moveX > 0) {
            this.events.trigger('touchRight', moveInfo);
          } else {
            this.events.trigger('touchLeft', moveInfo);
          }

          if (moveY > 0) {
            this.events.trigger('touchBottom', moveInfo);
          } else {
            this.events.trigger('touchTop', moveInfo);
          }
        });

        // touchend 事件监听
        let removeTouchEnd = addEvent(this.el, TOUCH_END, (e) => {
          this.events.trigger('touchend');
          removeTouchMove.remove();
          removeTouchEnd.remove();
          
          this.initData();
        });
      });
    }
  }

  function warn (msg) {
    console.error(`[BetterScroll warn]: ${msg}`);
  }

  function extend$1(target, ...reset) {
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
      
      this.options = extend$1({}, DEFAULT_OPTIONS, options);

      if (this.options.loop) {
        this.container.appendChild(this.container.children[0].cloneNode(true));
      }

      this.slides = this.container.children;
      this.slidesLength = this.slides.length;

      if (this.slidesLength === 0) ;

      this.percentDistance = this.slides[0].offsetWidth;


      this.currentIndex = 0;
    
      this.events = new EventBus();


      let touchBus = new TouchBus(this.wrapper);

      touchBus.on('touchend', (target) => {
        console.log(target);
        if (target.directX === 'left') {
          // 根据手指滑动的距离移动
          // ...
          // this.slidePrev()
          console.log('切换到上一个');
        } else {
          // this.slideNext()
          console.log('切换到下一个');
        }
      });

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
      this.events.trigger('slideChange', this.currentIndex);
    }

    slidePrev () {
      console.log('slidePrev');
    }

    on (event, handler) {
      this.events.on(event, handler);
    }

    slide () {

    }

    pause () {
      
    }
  }

  return BetterSwiper;

})));
