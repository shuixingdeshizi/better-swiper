const DEFAULT_OPTIONS = {
  initialSlide: 0,          // 设置初始化时better-swiper的索引
  direction: 'horizontal',  //  slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
  speed: 300                // 切换速度,即slider自动滑动开始到结束的时间（单位ms）
}

export function initMixin (BetterSwiper) {
  BetterSwiper.prototype._init = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options)
    this._events = {}
  }
}