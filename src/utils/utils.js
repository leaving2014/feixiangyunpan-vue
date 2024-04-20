export function debounce (fn, delay = 300) {
  let timer = null
  return function() {
    var that = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.call(that, args)
    }, delay)
  }
}
