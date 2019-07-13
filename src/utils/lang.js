export function getNow () {
  return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : Date.now()
}

export function extend(target, ...reset) {
  for (let i = 0; i < reset.length; i++) {
    let source = reset[i]
    for (let key in source) {
      target[key] = source[key]
    }
  }
  return target
}

export function isUndef (v) {
  return v === undefined || v === null
}

export function getDistance (x, y) {
  return Math.sqrt(x * x + y * y)
}