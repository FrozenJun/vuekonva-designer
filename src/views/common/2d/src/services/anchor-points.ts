import { KonvaEventObject } from 'konva/types/Node';
import store from '@/store';
import _ from 'lodash';
import {
  ANCHOR_RECT_OFFSET,
  ANCHOR_LINE_OFFSET
} from '../constants/variable.constant';
import { RECT_ANCHOR, CIRCLE_ANCHOR } from '../constants/anchor.constant';

/**
 * 锚点服务，直线，折线选中时出现的方块和圆点
 */
export class AnchorPointsService {
  anchors: any[] = []; // 描点集

  get recordService() {
    return store.state.recordService;
  }
  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }
  // 这里只保留了type为线段的cell
  get currentCells(): any[] {
    return (store.state.currentCells || []).filter(
      (cell: any) => cell.type === 'arrow'
    );
  }

  /**
   * 拖拽相关
   */
  rectDragmove(e: KonvaEventObject<DragEvent>, anchor: any) {
    const x = e.target.x();
    const y = e.target.y();
    const cell = anchor.bindCell;
    const points: any[] = cell.points;
    const index = anchor.id === 'start' ? 0 : points.length - 2;
    points[index] =
      x + (ANCHOR_RECT_OFFSET + anchor.strokeWidth / 2) / this.scale - cell.x;
    points[index + 1] =
      y + (ANCHOR_RECT_OFFSET + anchor.strokeWidth / 2) / this.scale - cell.y;
    // 如果接近水平或者垂直，强制移动至水平或垂直,根据和前后点的角度计算
    this.forceHorizontalOrVertical(
      e,
      cell,
      index,
      ANCHOR_RECT_OFFSET + anchor.strokeWidth / 2
    );
    this.update();
  }
  cirDragmove(e: KonvaEventObject<DragEvent>, anchor: any) {
    const x = e.target.x();
    const y = e.target.y();
    const cell = anchor.bindCell;
    const points: any[] = cell.points;
    const index = Number(anchor.id.split('-')[1]) + 2; // 序号从0开始，但是第一个点是rect点（起点）
    points[index] = x - cell.x;
    points[index + 1] = y - cell.y;
    // 如果接近水平或者垂直，强制移动至水平或垂直
    this.forceHorizontalOrVertical(e, cell, index, 0);
    this.update();
  }
  dragend() {
    this.recordService.add();
  }

  /**
   * 锚点的新增，删除和重置
   */
  addAnchors(cell: Record<string, any>) {
    // 移动直线的时候x,y值会改变
    // 计算开始点的方块锚点的位置
    // 这里宽，高，线宽除以scale，为了防止锚点随着scale的改变而改变
    const start = _.cloneDeep(RECT_ANCHOR);
    start.id = 'start';
    start.x = cell.x + cell.points[0] - ANCHOR_RECT_OFFSET / this.scale;
    start.y = cell.y + cell.points[1] - ANCHOR_RECT_OFFSET / this.scale;
    start.width = start.width! / this.scale;
    start.height = start.height! / this.scale;
    start.strokeWidth = start.strokeWidth! / this.scale;
    start.bindCell = cell;
    // 计算结束点的方块锚点的位置
    const end = _.cloneDeep(RECT_ANCHOR);
    end.id = 'end';
    end.x =
      cell.x +
      cell.points[cell.points.length - 2] -
      ANCHOR_RECT_OFFSET / this.scale;
    end.y =
      cell.y +
      cell.points[cell.points.length - 1] -
      ANCHOR_RECT_OFFSET / this.scale;
    end.width = end.width! / this.scale;
    end.height = end.height! / this.scale;
    end.strokeWidth = end.strokeWidth! / this.scale;
    end.bindCell = cell;
    this.anchors.push(start, end);
    // 折线还有额外的圆形锚点,这里要考虑到可能有多个折点,计算圆形锚点的位置
    if (cell.name === '折线') {
      // 获取折点的points集合
      const cirPoints = _.drop(_.dropRight(cell.points, 2), 2);
      cirPoints.forEach((p, index, arr) => {
        if (index % 2 === 1) return;
        const cir = _.cloneDeep(CIRCLE_ANCHOR);
        cir.id = `cir-${index}`;
        cir.x = cell.x + arr[index];
        cir.y = cell.y + arr[index + 1];
        cir.radius = cir.radius / this.scale;
        cir.strokeWidth = cir.strokeWidth! / this.scale;
        cir.bindCell = cell;
        this.anchors.push(cir);
      });
    }
  }
  remove() {
    this.anchors = [];
  }
  update() {
    this.remove();
    this.currentCells.forEach((cell) => this.addAnchors(cell));
  }

  /**
   * 当前选择改变时的回调
   */
  currentCellsChange(cells?: any[]) {
    this.remove();
    if (cells && cells.length)
      cells
        .filter((i) => i.type === 'arrow')
        .forEach(this.addAnchors.bind(this));
  }

  /**
   * 移动到不同anchor上时改变鼠标形状
   */
  mouseover(item: any) {
    switch (item.type) {
      case 'rect-anchor':
        document.body.style.cursor = 'nwse-resize';
        break;
      case 'circle-anchor':
        document.body.style.cursor = 'grab';
    }
  }
  mousedown(item: any) {
    switch (item.type) {
      case 'circle-anchor':
        document.body.style.cursor = 'grabbing';
    }
  }
  mouseout() {
    document.body.style.cursor = 'default';
  }

  /**
   * 如果当前点和前后两点接近水平或者垂直，强制移动至水平或垂直
   */
  forceHorizontalOrVertical(
    e: KonvaEventObject<DragEvent>,
    cell: Record<string, any>,
    index: number,
    offset: number
  ) {
    const { x, y, points } = cell;
    const x0 = points[index - 2];
    const y0 = points[index - 1];
    const x1 = points[index];
    const y1 = points[index + 1];
    const x2 = points[index + 2];
    const y2 = points[index + 3];
    // x0,y0,x2,y2可能等于0
    if (_.isNumber(x0) && _.isNumber(y0)) {
      if (Math.abs(x0 - x1) < ANCHOR_LINE_OFFSET) {
        points[index] = x0;
        e.target.x(x0 - offset + x);
      }
      if (Math.abs(y0 - y1) < ANCHOR_LINE_OFFSET) {
        points[index + 1] = y0;
        e.target.y(y0 - offset + y);
      }
    }
    if (_.isNumber(x2) && _.isNumber(y2)) {
      if (Math.abs(x2 - x1) < ANCHOR_LINE_OFFSET) {
        points[index] = x2;
        e.target.x(x2 - offset + x);
      }
      if (Math.abs(y2 - y1) < ANCHOR_LINE_OFFSET) {
        points[index + 1] = y2;
        e.target.y(y2 - offset + y);
      }
    }

    this.update();
  }
}
