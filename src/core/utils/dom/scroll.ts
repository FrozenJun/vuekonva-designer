import { isIOS } from '../base/assert';
import { addClass, removeClass } from './class';

export const pageScroll = (function() {
  const fn = function(e: any) {
    e.preventDefault();
    e.stopPropagation();
  };
  let islock = false;

  return {
    lock(el: any) {
      if (islock) return;
      islock = true;
      (el || document).addEventListener('touchmove', fn);
    },
    unlock(el: any) {
      islock = false;
      (el || document).removeEventListener('touchmove', fn);
    }
  };
})();

export const getScrollview = function(el: any) {
  let currentNode = el;
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    const overflowY = (document as any).defaultView.getComputedStyle(
      currentNode
    ).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
};

/**
 * 判断el是否进入了scrollView中
 * @param scrollView scroll区域
 * @param el 判断是否再scroll区域中的dom
 */
export const checkInView = function(scrollView: any, el: any) {
  const contentHeight =
    scrollView === window
      ? document.body.offsetHeight
      : scrollView.offsetHeight;
  const contentTop =
    scrollView === window ? 0 : scrollView.getBoundingClientRect().top;

  const post = el.getBoundingClientRect().top - contentTop;
  const posb = post + el.offsetHeight;

  return (
    (post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight)
  );
};

export const preventScroll = (function() {
  return {
    lock(el: any) {
      isIOS && addClass(el || document.body, 'g-fix-ios-prevent-scroll');
    },
    unlock(el: any) {
      isIOS && removeClass(el || document.body, 'g-fix-ios-prevent-scroll');
    }
  };
})();

// Copy from iView. https://www.iviewui.com/
export const scrollTop = function(
  el: any,
  from = 0,
  to: any,
  duration = 500,
  callback: any
) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  function scroll(start: any, end: any, step: any) {
    if (start === end) {
      typeof callback === 'function' && callback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
};
