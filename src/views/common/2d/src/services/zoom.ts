import store from '@/store';
import Vue from 'vue';
import {
  BASE_WIDTH,
  BASE_HEIGHT,
  HORIZONTAL_BLANK,
  VERTICAL_BLANK,
  MAX_SCALE,
  MIN_SCALE
} from '../constants/variable.constant';

/**
 * 画布放大缩小功能
 */
export class ZoomService {
  zoomValue = 100;
  canvasEl: Element | null = null;

  get scale() {
    return this.zoomValue / 100;
  }
  get transformService() {
    return store.state.transformService;
  }
  get anchorPointsService() {
    return store.state.anchorPointsService;
  }
  // 用户设置的canvas的宽高等数据
  get canvasModel() {
    return store.state.content.canvas;
  }
  get width() {
    return this.canvasModel ? this.canvasModel.width : BASE_WIDTH;
  }
  get height() {
    return this.canvasModel ? this.canvasModel.height : BASE_HEIGHT;
  }
  get isWidthOverflow() {
    if (!this.canvasEl) return false;
    const elRect = this.canvasEl!.getBoundingClientRect();
    return this.width * this.scale > elRect.width - HORIZONTAL_BLANK;
  }
  get isHeightOverflow() {
    if (!this.canvasEl) return false;
    const elRect = this.canvasEl!.getBoundingClientRect();
    return this.height * this.scale > elRect.height - VERTICAL_BLANK;
  }
  /**
   * stage放大缩小不应该只改变画布的宽高,因为画布内容大小位置是固定的
   * 还应该改变scale值
   */
  get canvasSize() {
    return {
      width: this.width * this.scale,
      height: this.height * this.scale,
      scale: { x: this.scale, y: this.scale }
    };
  }
  /**
   * 容器放大缩小应该只改变其宽高，因为画布内容缩放已经在stage中完成
   */
  get containerSize() {
    return {
      width: `${this.width * this.scale}px`,
      height: `${this.height * this.scale}px`
    };
  }
  get isAddDisable() {
    return this.zoomValue >= MAX_SCALE;
  }
  get isReduceDisable() {
    return this.zoomValue <= MIN_SCALE;
  }

  init(el: Element) {
    this.canvasEl = el;
    window.onresize = _.throttle(this.computedZoomValue.bind(this), 300);
  }
  computedZoomValue() {
    if (!this.canvasEl) return;
    const elRect = this.canvasEl!.getBoundingClientRect();
    // 画布左右需要有一定的留白，所以判断值比默认的宽大100，高大60
    // 宽满足就好，有时候满足高会显得太小
    const widthScale = (elRect.width - HORIZONTAL_BLANK) / this.width;
    // const heightScale = (elRect.height - VERTICAL_BLANK) / this.height;
    const zoom = Math.max(widthScale, MIN_SCALE / 100);
    this.zoomValue = Math.round(zoom * 100);
    // 缩放刷新transformer,防止大小随缩放改变
    Vue.nextTick(() => {
      this.transformService.update();
      this.anchorPointsService.update();
    });
  }

  add() {
    const step = this.zoomValue < 100 ? 10 : 50;
    if (this.zoomValue < MAX_SCALE) {
      this.zoomValue = Math.min(
        MAX_SCALE,
        Math.floor(this.zoomValue / step + 1) * step
      );
      // 缩放刷新transformer,防止大小随缩放改变
      Vue.nextTick(() => {
        this.transformService.update();
        this.anchorPointsService.update();
      });
    }
  }
  reduce() {
    const step = this.zoomValue <= 100 ? 10 : 50;
    if (this.zoomValue > MIN_SCALE) {
      this.zoomValue = Math.max(
        MIN_SCALE,
        Math.ceil(this.zoomValue / step - 1) * step
      );
    }
    // 缩放刷新transformer,防止大小随缩放改变
    Vue.nextTick(() => {
      this.transformService.update();
      this.anchorPointsService.update();
    });
  }

  removeListener() {
    window.onresize = null;
  }
}
