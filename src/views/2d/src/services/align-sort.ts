import store from '@/store';

/**
 * 排列和对齐服务
 * 多选时的分布，对齐和排列功能
 */
export class AlignSortService {
  get recordService() {
    return store.state.recordService;
  }
  get transformService() {
    return store.state.transformService;
  }
  get anchorPointsService() {
    return store.state.anchorPointsService;
  }
  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }
  get layer() {
    return store.state.layer.getNode();
  }
  get shapeList(): Record<string, any>[] {
    return store.state.content.shapeList;
  }
  get currentCells(): any[] {
    return store.state.currentCells || [];
  }
  get currentCell() {
    return this.currentCells && this.currentCells.length === 1
      ? this.currentCells[0]
      : null;
  }
  get index() {
    const { currentCell, shapeList } = this;
    if (!currentCell || !shapeList.length) return 0;
    return shapeList.map((i) => i.id).indexOf(currentCell.id);
  }

  /**
   * 分布
   */
  layout(type: string) {
    switch (type) {
      case 'horizontal':
        this.layoutHorizontal();
        break;
      case 'vertical':
        this.layoutVertical();
    }
  }

  /**
   * 对齐
   */
  align(type: string) {
    switch (type) {
      case 'left':
        this.left();
        break;
      case 'horizontal':
        this.horizontal();
        break;
      case 'right':
        this.right();
        break;
      case 'up':
        this.up();
        break;
      case 'vertical':
        this.vertical();
        break;
      case 'down':
        this.down();
    }
  }

  /**
   * 顺序
   */
  sort(type: string) {
    switch (type) {
      case 'forward':
        this.forward();
        break;
      case 'backward':
        this.backward();
        break;
      case 'top':
        this.top();
        break;
      case 'bottom':
        this.bottom();
    }
  }

  /**
   * 分布的具体操作
   */
  layoutHorizontal() {
    const { boxs } = this.getCellsPoints();
    // 获得中心点x从小到大排序的cells
    const sortCells = boxs.sort((a, b) => {
      return a.x + a.width / 2 - (b.x + b.width / 2);
    });
    const startCell = sortCells[0];
    const endCell = sortCells[sortCells.length - 1];
    const startCenter = (startCell.x + startCell.width / 2) / this.scale;
    const endCenter = (endCell.x + endCell.width / 2) / this.scale;
    // 计算每段间隔
    const spacing = (endCenter - startCenter) / (sortCells.length - 1);
    sortCells.forEach(({ cell }, index) => {
      if (index === 0 || index === sortCells.length - 1) return;
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const x = this.getExpectPoint(cell.points, 'mid', 'horizontal');
        cell.x = startCenter + spacing * index - x;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.x =
          startCenter +
          spacing * index +
          cell.offsetX * 2 -
          cell.width / 2 +
          (cell.scaleX - 1) * cell.width;
      } else {
        cell.x = startCenter + spacing * index + cell.offsetX - cell.width / 2;
      }
    });
    this.afterLayout();
  }
  layoutVertical() {
    const { boxs } = this.getCellsPoints();
    // 获得中心点y从小到大排序的cells
    const sortCells = boxs.sort((a, b) => {
      return a.y + a.height / 2 - (b.y + b.height / 2);
    });
    const startCell = sortCells[0];
    const endCell = sortCells[sortCells.length - 1];
    const startCenter = (startCell.y + startCell.height / 2) / this.scale;
    const endCenter = (endCell.y + endCell.height / 2) / this.scale;
    // 计算每段间隔
    const spacing = (endCenter - startCenter) / (sortCells.length - 1);
    sortCells.forEach(({ cell }, index) => {
      if (index === 0 || index === sortCells.length - 1) return;
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const y = this.getExpectPoint(cell.points, 'mid', 'vertical');
        cell.y = startCenter + spacing * index - y;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.y =
          startCenter +
          spacing * index +
          cell.offsetY * 2 -
          cell.height / 2 +
          (cell.scaleY - 1) * cell.height;
      } else {
        cell.y = startCenter + spacing * index + cell.offsetY - cell.height / 2;
      }
    });
    this.afterLayout();
  }
  afterLayout() {
    this.layer.draw();
    this.anchorPointsService.update();
    this.transformService.update();
    this.recordService.add();
  }

  /**
   * 对齐的具体操作
   * 公式画图感受试验得出
   */
  left() {
    const { x0 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const x = this.getExpectPoint(cell.points, 'min', 'horizontal');
        cell.x = x0 + cell.strokeWidth - x;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.x =
          x0 +
          cell.offsetX * 2 +
          cell.strokeWidth +
          (cell.scaleX - 1) * cell.width;
      } else {
        cell.x =
          x0 +
          cell.offsetX +
          cell.strokeWidth +
          ((cell.scaleX - 1) * cell.width) / 2;
      }
    });
    this.afterAlign();
  }
  horizontal() {
    const { x1 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const x = this.getExpectPoint(cell.points, 'mid', 'horizontal');
        cell.x = x1 - x;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.x =
          x1 +
          cell.offsetX * 2 -
          cell.width / 2 +
          ((cell.scaleX - 1) * cell.width) / 2;
      } else {
        cell.x = x1 + cell.offsetX - cell.strokeWidth - cell.width / 2;
      }
    });
    this.afterAlign();
  }
  right() {
    const { x2 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const x = this.getExpectPoint(cell.points, 'max', 'horizontal');
        cell.x = x2 - cell.strokeWidth - x;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.x = x2 + cell.offsetX * 2 - cell.strokeWidth - cell.width;
      } else {
        cell.x =
          x2 +
          cell.offsetX -
          cell.strokeWidth -
          ((cell.scaleX + 1) * cell.width) / 2;
      }
    });
    this.afterAlign();
  }
  up() {
    const { y0 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const y = this.getExpectPoint(cell.points, 'min', 'vertical');
        cell.y = y0 + cell.strokeWidth - y;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.y =
          y0 +
          cell.offsetY * 2 +
          cell.strokeWidth +
          (cell.scaleY - 1) * cell.height;
      } else {
        cell.y =
          y0 +
          cell.offsetY +
          cell.strokeWidth +
          ((cell.scaleY - 1) * cell.height) / 2;
      }
    });
    this.afterAlign();
  }
  vertical() {
    const { y1 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const y = this.getExpectPoint(cell.points, 'mid', 'vertical');
        cell.y = y1 - y;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.y =
          y1 +
          cell.offsetY * 2 -
          cell.height / 2 +
          ((cell.scaleY - 1) * cell.height) / 2;
      } else {
        cell.y = y1 + cell.offsetY - cell.height / 2;
      }
    });
    this.afterAlign();
  }
  down() {
    const { y2 } = this.getCellsPoints();
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段需要同时考虑x和端点
        const y = this.getExpectPoint(cell.points, 'max', 'vertical');
        cell.y = y2 - cell.strokeWidth - y;
      } else if (cell.type === 'circle') {
        // 圆形从左侧拖入至画布时已经加了offset值，所以这里要双倍
        // 和width，height计算相关时要计算scale产生的距离的问题
        cell.y = y2 + cell.offsetY * 2 - cell.strokeWidth - cell.height;
      } else {
        cell.y =
          y2 +
          cell.offsetY -
          cell.strokeWidth -
          ((cell.scaleY + 1) * cell.height) / 2;
      }
    });
    this.afterAlign();
  }
  afterAlign() {
    this.layer.draw();
    this.anchorPointsService.update();
    this.transformService.update();
    this.recordService.add();
  }

  /**
   * 顺序的具体操作
   */
  forward() {
    // 在shapeList中越靠后，层级越高
    // this.index可能会在shapeList改变时改变，所以取现在的值
    const index = this.index;
    const indexItem = this.shapeList[index];
    this.shapeList[index] = this.shapeList[index + 1];
    this.shapeList[index + 1] = indexItem;
    this.afterSort();
  }
  backward() {
    // 在shapeList中越靠后，层级越高
    // this.index可能会在shapeList改变时改变，所以取现在的值
    const index = this.index;
    const indexItem = this.shapeList[index];
    this.shapeList[index] = this.shapeList[index - 1];
    this.shapeList[index - 1] = indexItem;
    this.afterSort();
  }
  top() {
    const indexItem = this.shapeList[this.index];
    this.shapeList.splice(this.index, 1);
    this.shapeList.push(indexItem);
    this.afterSort();
  }
  bottom() {
    const indexItem = this.shapeList[this.index];
    this.shapeList.splice(this.index, 1);
    this.shapeList.unshift(indexItem);
    this.afterSort();
  }
  getSortDisabled(type: string) {
    let disabled = false;
    // 设置排序按钮的禁用,在shapeList中越靠后，层级越高
    const max = this.shapeList.length - 1;
    if (
      max === 0 ||
      (this.index === 0 && (type === 'bottom' || type === 'backward')) ||
      (this.index === max && (type === 'top' || type === 'forward'))
    ) {
      disabled = true;
    }
    return disabled;
  }
  afterSort() {
    this.recordService.add();
    this.transformService.forceUpdate();
  }

  /**
   * 工具
   */
  // 计算cells各个关键点 最左，水平中间，最右，最上，垂直中间，最下
  getCellsPoints() {
    const boxs = this.currentCells.map((cell) => {
      const node = this.layer.findOne(`#${cell.id}`);
      return { ...node.getClientRect(), cell };
    });
    const x0 =
      boxs.reduce((a, b) => (a < b.x ? a : b.x), Infinity) / this.scale;
    const x2 =
      boxs.reduce(
        (a, b) => (a > b.x + b.width ? a : b.x + b.width),
        -Infinity
      ) / this.scale;
    const x1 = (x0 + x2) / 2;
    const y0 =
      boxs.reduce((a, b) => (a < b.y ? a : b.y), Infinity) / this.scale;
    const y2 =
      boxs.reduce(
        (a, b) => (a > b.y + b.height ? a : b.y + b.height),
        -Infinity
      ) / this.scale;
    const y1 = (y0 + y2) / 2;
    return { x0, x1, x2, y0, y1, y2, boxs };
  }
  // 获取期望的point的值
  getExpectPoint(
    points: number[],
    size: 'min' | 'max' | 'mid',
    direction: 'vertical' | 'horizontal'
  ) {
    const x0 = points[0];
    const y0 = points[1];
    const x1 = points[points.length - 2];
    const y1 = points[points.length - 1];
    if (size === 'min' && direction === 'horizontal') {
      return x0 > x1 ? x1 : x0;
    } else if (size === 'max' && direction === 'horizontal') {
      return x0 > x1 ? x0 : x1;
    } else if (size === 'mid' && direction === 'horizontal') {
      return (x0 + x1) / 2;
    } else if (size === 'min' && direction === 'vertical') {
      return y0 > y1 ? y1 : y0;
    } else if (size === 'max' && direction === 'vertical') {
      return y0 > y1 ? y0 : y1;
    } else {
      return (y0 + y1) / 2;
    }
  }
}
