import { InputAdapter } from '@/core/components/base/form/input/src/BaseInput.adapter';
import { KonvaEventObject } from 'konva/types/Node';
import store from '@/store';

/**
 * 字体服务，对于文本，多行文本cell中字体功能的集合
 */
export class FontService {
  currentTextCell: any = null;
  textCellValue = '';
  textareaCellValue = '';

  showTextInput = false;
  showTextareaInput = false;

  get currentCell() {
    const cell =
      this.currentCells && this.currentCells.length === 1
        ? this.currentCells[0]
        : null;
    return cell;
  }
  get stage() {
    return store.state.stage.getStage();
  }
  get currentCells() {
    return store.state.currentCells;
  }
  get recordService() {
    return store.state.recordService;
  }
  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }

  textCellConfig: InputAdapter = {
    on: {
      modelChange: (v) => {
        if (this.currentCell) this.currentCell.text = v;
      }
    },
    ref: null
  };
  textareaCellConfig: InputAdapter = {
    on: {
      modelChange: (v) => {
        if (this.currentCell) this.currentCell.text = v;
      }
    },
    type: 'textarea',
    ref: null
  };

  get textStyle() {
    const cell = this.currentCell;
    if (!cell) return {};
    return {
      left: `${(cell.x - cell.offsetX) * this.scale}px`,
      top: `${(cell.y - cell.offsetY) * this.scale}px`,
      width: `${cell.width}px`,
      height: `${cell.height}px`,
      textDecoration: cell.textDecoration,
      transform: `scale(${this.scale})`,
      transformOrigin: '0 0'
    };
  }
  get textInputStyle() {
    const cell = this.currentCell;
    const fontStyle = cell.fontStyle.split('bold').join('');
    const fontWeight = cell.fontStyle.includes('bold') ? 'bold' : 'normal';
    return {
      fontSize: `${cell.fontSize}px`,
      fontFamily: cell.fontFamily,
      fontStyle,
      fontWeight,
      lineHeight: cell.lineHeight,
      textAlign: cell.align,
      color: cell.fill,
      padding: '0 0 0 10px',
      border: 0,
      width: `${cell.width}px`,
      height: `${cell.height}px`,
      background: 'transparent'
    };
  }
  get textareaStyle() {
    return {
      ...this.textInputStyle,
      padding: '10px 0 0 10px'
    };
  }
  get inputRef() {
    const ref = this.textCellConfig.ref;
    if (!ref) return null;
    return ref.$refs.input as any;
  }
  get textareaRef() {
    const ref = this.textareaCellConfig.ref;
    if (!ref) return null;
    return ref.$refs.textarea as any;
  }

  setFontStyle(type: string) {
    switch (type) {
      case 'bold':
        this.currentCell.fontStyle = this.getFontStyleByType('bold');
        break;
      case 'italic':
        this.currentCell.fontStyle = this.getFontStyleByType('italic');
        break;
      case 'underline':
        this.currentCell.textDecoration =
          this.currentCell.textDecoration === 'underline'
            ? 'empty'
            : 'underline';
    }
    this.recordService.add();
  }
  setFontAlign(type: string) {
    switch (type) {
      case 'left':
        this.currentCell.align = 'left';
        break;
      case 'center':
        this.currentCell.align = 'center';
        break;
      case 'right':
        this.currentCell.align = 'right';
        break;
      case 'top':
        this.currentCell.verticalAlign = 'top';
        break;
      case 'middle':
        this.currentCell.verticalAlign = 'middle';
        break;
      case 'bottom':
        this.currentCell.verticalAlign = 'bottom';
    }
    this.recordService.add();
  }
  showInput() {
    const cell = this.currentCell;
    this.currentTextCell = cell;
    this.textCellValue = cell.text;
    _.forOwn(this.textInputStyle, (v, k) => {
      this.inputRef.style[k] = v;
    });
    this.showTextInput = true;
    const node = this.stage.findOne('#' + cell.id);
    node.hide();
    document.body.style.cursor = 'default';
    setTimeout(() => {
      this.inputRef.focus();
    }, 0);
  }
  showTextarea() {
    const cell = this.currentCell;
    this.currentTextCell = cell;
    this.textareaCellValue = cell.text;
    _.forOwn(this.textareaStyle, (v, k) => {
      this.textareaRef.style[k] = v;
    });
    this.showTextareaInput = true;
    const node = this.stage.findOne('#' + cell.id);
    node.hide();
    document.body.style.cursor = 'default';
    setTimeout(() => {
      this.textareaRef.focus();
    }, 0);
  }
  hiddenTextOrTextarea() {
    const cell = this.currentTextCell;
    if (!cell) return;
    this.showTextInput = false;
    this.showTextareaInput = false;
    const node = this.stage.findOne('#' + cell.id);
    node.show();
    this.currentTextCell = null;
  }
  dblclick(e: KonvaEventObject<MouseEvent>) {
    this.hiddenTextOrTextarea();
    // 双击显示input或者textarea
    switch (e.target.attrs.type) {
      case 'text':
        this.showInput();
        break;
      case 'textarea':
        this.showTextarea();
    }
  }
  keydown(e: KeyboardEvent) {
    // esc隐藏
    if (e.keyCode === 27) {
      this.hiddenTextOrTextarea();
    }
    // enter隐藏 但是shift + enter不隐藏
    // textarea不隐藏
    if (
      e.keyCode === 13 &&
      !e.shiftKey &&
      this.currentTextCell.type === 'text'
    ) {
      this.hiddenTextOrTextarea();
    }
  }

  getFontStyleByType(type: string) {
    const now = this.currentCell.fontStyle.split(' ');
    if (now.length === 1) {
      if (now[0] === 'normal') {
        return type;
      } else if (now[0] === type) {
        return 'normal';
      } else {
        return `${now[0]} ${type}`;
      }
    } else {
      return now.filter((i: string) => i !== type)[0];
    }
  }
  currentCellsChange(cells: any[] = []) {
    const cell = cells && cells.length === 1 ? cells[0] : null;
    if (!cell || !this.currentTextCell || cell.id !== this.currentTextCell.id) {
      this.hiddenTextOrTextarea();
    } else {
      switch (cell.type) {
        case 'text':
          this.showInput();
          break;
        case 'textarea':
          this.showTextarea();
      }
    }
  }
}
