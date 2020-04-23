// 防抖函数（减少函数的调用）
export function debounce(func, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this,args);
    }, delay);
  };
}