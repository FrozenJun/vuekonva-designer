import store from '@/store';
import { KonvaEventObject } from 'konva/types/Node';
import Konva from 'konva';
import { Rect } from 'konva/types/shapes/Rect';
import { StageDataContent } from '../utils/2d.dto';
import Vue from 'vue';

/**
 * 鼠标按住拖动，多选功能
 */
export class MulitpleChoiceService {
  x!: number; // 起点的x
  y!: number; // 起点的y
  rect?: Rect; // 当前出现的选择框
  isMouseDown = false; // 只有在mousedown时才算正在选择中

  get content(): StageDataContent {
    return store.state.content;
  }
  get stage() {
    return store.state.stage.getStage();
  }
  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }
  get layer() {
    return store.state.layer.getNode();
  }
  get transformService() {
    return store.state.transformService;
  }

  start(e: KonvaEventObject<MouseEvent>) {
    this.isMouseDown = true;
    this.x = e.evt.offsetX / this.scale;
    this.y = e.evt.offsetY / this.scale;
  }
  moving(e: KonvaEventObject<MouseEvent>) {
    if (!this.isMouseDown) return;
    const { x, y } = this;
    const x1 = e.evt.offsetX / this.scale;
    const y1 = e.evt.offsetY / this.scale;
    const rect = new Konva.Rect({
      x: x1 < x ? x1 : x,
      y: y1 < y ? y1 : y,
      width: Math.abs(x1 - x),
      height: Math.abs(y1 - y),
      fill: 'rgba(195, 207, 228, 0.3)',
      stroke: '#000',
      strokeWidth: 1
    });
    // 删除上一个rect
    this.rect && this.rect.destroy();
    this.layer.add(rect);
    this.rect = rect;
    this.layer.draw();
  }
  end() {
    this.isMouseDown = false;
    this.rect && this.rect.destroy();
    this.layer.draw();
    if (this.rect) {
      const x0 = this.rect.x();
      const x1 = x0 + this.rect.width();
      const y0 = this.rect.y();
      const y1 = y0 + this.rect.height();
      // 计算rect中完整包含了多少cell
      const cells = this.content.shapeList.filter(({ id }) => {
        const shape = this.layer.findOne(`#${id}`);
        if (!shape) return false;
        const box = shape.getClientRect();
        const bx0 = box.x / this.scale;
        const bx1 = bx0 + box.width / this.scale;
        const by0 = box.y / this.scale;
        const by1 = by0 + box.height / this.scale;
        return bx0 >= x0 && bx1 <= x1 && by0 >= y0 && by1 <= y1;
      });
      store.commit('setCurrentCells', cells);
      Vue.nextTick(() => this.transformService.update());
    }
    this.rect = undefined;
  }
}
