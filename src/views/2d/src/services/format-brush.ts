import store from '@/store';

/**
 * 格式刷功能
 */
export class FormatBrushService {
  selectCell: any = null; // 当前已选中的cell,给个初始值为了使变为其响应式

  get currentCells(): any[] {
    return store.state.currentCells || [];
  }
  get recordService() {
    return store.state.recordService;
  }
  get disabled() {
    if (this.selectCell) return false;
    if (this.currentCells.length !== 1) return true;
    // 图片不需要格式刷
    const cell = this.currentCells[0];
    return cell.type === 'image';
  }

  set() {
    // 如果已经点击，再次点击取消选中
    if (this.selectCell) return this.reset();
    if (this.disabled) return;
    this.selectCell = this.currentCells[0];
    // 选中后清空当前所选
    store.commit('setCurrentCells', []);
  }
  reset() {
    this.selectCell = null;
  }

  format() {
    this.currentCells
      .filter((cell) => {
        if (cell.id === this.selectCell.id) return false;
        switch (this.selectCell.type) {
          case 'text':
            return ['text', 'textarea'].includes(cell.type);
          case 'textarea':
            return ['text', 'textarea'].includes(cell.type);
          case 'image':
            return false;
          case 'arrow':
            return cell.type === 'arrow';
          case 'circle':
            return ['circle', 'rect'].includes(cell.type);
          case 'rect':
            return ['circle', 'rect'].includes(cell.type);
        }
      })
      .forEach((cell) => {
        switch (this.selectCell.type) {
          case 'text':
            this.textFormat(cell);
            break;
          case 'textarea':
            this.textFormat(cell);
            break;
          case 'arrow':
            this.arrowFormat(cell);
            break;
          case 'circle':
            this.shapeFormat(cell);
            break;
          case 'rect':
            return this.shapeFormat(cell);
        }
      });
    this.reset();
    store.commit('setCurrentCells', []);
    this.recordService.add();
  }

  textFormat(cell: any) {
    const {
      fontFamily,
      fontStyle,
      fontSize,
      textDecoration,
      align,
      fill,
      verticalAlign,
      lineHeight,
      stroke
    } = this.selectCell;
    cell.fontFamily = fontFamily;
    cell.fontStyle = fontStyle;
    cell.fontSize = fontSize;
    cell.textDecoration = textDecoration;
    cell.align = align;
    cell.fill = fill;
    cell.verticalAlign = verticalAlign;
    cell.lineHeight = lineHeight;
    cell.stroke = stroke;
  }
  arrowFormat(cell: any) {
    const {
      stroke,
      strokeWidth,
      dashEnabled,
      pointerWidth,
      pointerLength,
      pointerAtBeginning,
      fill
    } = this.selectCell;
    cell.stroke = stroke;
    cell.strokeWidth = strokeWidth;
    cell.pointerLength = pointerLength;
    cell.dashEnabled = dashEnabled;
    cell.pointerWidth = pointerWidth;
    cell.pointerAtBeginning = pointerAtBeginning;
    cell.fill = fill;
  }
  // 圆形，方形可以互相刷
  shapeFormat(cell: any) {
    const { stroke, strokeWidth, dashEnabled, fill } = this.selectCell;
    cell.stroke = stroke;
    cell.strokeWidth = strokeWidth;
    cell.dashEnabled = dashEnabled;
    cell.fill = fill;
  }
}
