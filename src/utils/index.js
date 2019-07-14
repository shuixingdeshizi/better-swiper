const objectToString = Object.prototype.toString


export const isArray = (v) => {
  return objectToString.call(v).slice(8, -1) === 'Array'
} 

export const arraySlice = (v, start, end) => {
  return Array.prototype.slice.call(v, start, end)
}

export const extend = (target, ...reset) => {
  for (let i = 0, l = reset.length; i < l; i++) {
    let source = reset[i]
    for (let key in source) {
      target[key] = source[key]
    }
  }

  return target
}

export const assert = (msg) => {
  console.log(`[touch-bus]warn:${msg}`)
}


export const removeEvent = (target, event, handler) => {
  target.removeEventListener(event, handler)
}

export const addEvent = (target, event, handler) => {
  if (!target || !target.nodeType) {
    console.log(target)
  }
  target.addEventListener(event, handler)
  return {
    remove () {
      removeEvent(target, event, handler)
    }
  }
}