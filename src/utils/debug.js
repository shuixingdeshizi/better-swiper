export function warn (msg) {
  console.error(`[BetterScroll warn]: ${msg}`)
}

export function assert (condition, msg) {
  if (!condition) {
    throw new Error(`[BetterScroll]: ${msg}`)
  }
}