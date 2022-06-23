import { Component, Prop } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto.ts';
import { KonvaEventObject } from 'konva/types/Node';
import { getListMaxId } from '../../utils/2d.util';
import { State } from 'vuex-class';
import {
  TransformService,
  RecordService,
  AnchorPointsService
} from '../../services';
import { StageDataContent } from '../../utils/2d.dto';
import { AlignSortService } from '../../services/align-sort';
import { CONTEXT_MENU } from '../../constants/context-menu';
import {
  PASTE_X_OFFSET,
  PASTE_Y_OFFSET,
  IS_MAC
} from '../../constants/variable.constant';

@Component({})
export class BsContextMenuConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;
  CONTEXT_MENU = CONTEXT_MENU;

  @Prop({ type: Object }) headerRef: any;

  @State('anchorPointsService') anchorPointsService!: AnchorPointsService;
  @State('transformService') transformService!: TransformService;
  @State('alignSortService') alignSortService!: AlignSortService;
  @State('recordService') recordService!: RecordService;
  @State('content') Content!: StageDataContent;
  @State('currentCells') currentCells!: any[];

  copyCells: any[] = []; // 当前拷贝或者剪切的cell

  get stage() {
    return this.$store.state.stage.getStage();
  }
  get menu() {
    return this.$refs.menu;
  }
  get shapeList() {
    return this.Content.shapeList || [];
  }

  mounted() {
    this.stage.on('contextmenu', (e: any) => this.stageOnContextmenu(e));
    // 监听键盘按键和屏幕点击事件
    window.addEventListener('click', this.hiddenMenu);
    window.addEventListener('keydown', this.keydownEvent);
    window.addEventListener('keyup', this.keyupEvent);
  }
  beforeDestroy() {
    window.removeEventListener('click', this.hiddenMenu);
    window.removeEventListener('keydown', this.keydownEvent);
    window.removeEventListener('keyup', this.keyupEvent);
  }

  stageOnContextmenu(e: KonvaEventObject<Event>) {
    // 屏蔽默认右击菜单事件
    e.evt.preventDefault();
    this.setMenuDisabled();
    this.showMenu();
  }
  keydownEvent(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 8: // Backspace 删除
        if (this.currentCells.length) {
          this.del();
          this.recordService.add();
        }
        break;
      case 46: // Delete 删除
        if (this.currentCells.length) {
          this.del();
          this.recordService.add();
        }
        break;
      case 38: // ↑
        this.move('up');
        this.recordService.add();
        this.currentCells.length && e.preventDefault();
        break;
      case 40: // ↓
        this.move('down');
        this.recordService.add();
        this.currentCells.length && e.preventDefault();
        break;
      case 37: // ←
        this.move('left');
        this.recordService.add();
        this.currentCells.length && e.preventDefault();
        break;
      case 39: // →
        this.move('right');
        this.recordService.add();
        this.currentCells.length && e.preventDefault();
        break;
      case 70: // Ctrl/Command + F 搜索
        if (IS_MAC ? e.metaKey : e.ctrlKey) {
          this.search();
          e.preventDefault();
        }
        break;
      case 83: // Ctrl/Command + S 保存
        if (IS_MAC ? e.metaKey : e.ctrlKey) {
          this.save();
          e.preventDefault();
        }
        break;
      case 65: // Ctrl/Command + A 全选
        if (IS_MAC ? e.metaKey : e.ctrlKey) {
          this.selectAll();
          e.preventDefault();
        }
        break;
      case 90:
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && !e.shiftKey) {
          // Ctrl/Command + Z 撤销
          this.recordService.revoke();
        } else if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey) {
          // Ctrl/Command + Shift + Z 恢复
          this.recordService.restore();
        }
        break;
      case 116: // F5 预览
        this.preview();
        break;
      case 88: // Ctrl/Command + X 剪切
        if (this.currentCells.length && (IS_MAC ? e.metaKey : e.ctrlKey)) {
          this.cut();
          this.recordService.add();
        }
        break;
      // 复制在下方，和水平居中同一个字母C
      case 86: // Ctrl/Command + V 粘贴
        if (IS_MAC ? e.metaKey : e.ctrlKey) {
          this.paste();
          this.recordService.add();
        }
        break;
      case 219:
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && !e.shiftKey) {
          // Ctrl/Command + [ 后移
          !this.sortDisabled('backward') && this.backward();
        } else if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey) {
          // Ctrl/Command + shift + [ 置底
          !this.sortDisabled('bottom') && this.bottom();
        }
        e.preventDefault();
        break;
      case 221:
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && !e.shiftKey) {
          // Ctrl/Command + ] 前移
          !this.sortDisabled('forward') && this.forward();
        } else if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey) {
          // Ctrl/Command + shift + ] 置顶
          !this.sortDisabled('top') && this.top();
        }
        e.preventDefault();
        break;
      case 76: // Ctrl/Command + Alt + L 左对齐
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.left();
          e.preventDefault();
        }
        break;
      case 67: // Ctrl/Command + Alt + C 水平居中
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.horizontal();
          e.preventDefault();
        }
        // Ctrl/Command + C 复制
        if (
          this.currentCells.length &&
          (IS_MAC ? e.metaKey : e.ctrlKey) &&
          !e.altKey
        ) {
          this.copy();
        }
        break;
      case 82: // Ctrl/Command + Alt + R 右对齐
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.right();
          e.preventDefault();
        }
        break;
      case 84: // Ctrl/Command + Alt + T 上对齐
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.up();
          e.preventDefault();
        }
        break;
      case 77: // Ctrl/Command + Alt + M 垂直居中
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.vertical();
          e.preventDefault();
        }
        break;
      case 66: // Ctrl/Command + Alt + B 下对齐
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.altKey) {
          this.down();
          e.preventDefault();
        }
        break;
      case 72: // Ctrl/Command + Shift + H 水平分布
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey) {
          this.layoutHorizontal();
          e.preventDefault();
        }
        break;
      case 85: // Ctrl/Command + Shift + U 垂直分布
        if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey) {
          this.layoutVertical();
          e.preventDefault();
        }
        break;
    }
    this.hiddenMenu();
  }
  keyupEvent(e: KeyboardEvent) {
    if ([37, 38, 39, 40].includes(e.keyCode)) {
      this.anchorPointsService.update();
      this.transformService.isMoving(false);
    }
  }
  onMenuClick(menu: any) {
    if (!menu.disabled && !menu.children) {
      this.hiddenMenu();
    }
    if (!menu.type || menu.disabled) return;
    switch (menu.type) {
      case 'cut':
        this.cut();
        this.recordService.add();
        break;
      case 'copy':
        this.copy();
        break;
      case 'paste':
        this.paste();
        this.recordService.add();
        break;
      case 'del':
        this.del();
        this.recordService.add();
        break;
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
        break;
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
        break;
      case 'layoutHorizontal':
        this.layoutHorizontal();
        break;
      case 'layoutVertical':
        this.layoutVertical();
    }
  }
  setMenuDisabled() {
    if (!this.currentCells.length) {
      // 点击在画布的空白地方或者未选择的cell上
      CONTEXT_MENU.forEach((i) => {
        i.disabled = !(this.copyCells.length && i.type === 'paste');
        i.children &&
          i.children.forEach((i) => {
            i.disabled = true;
          });
      });
    } else if (this.currentCells.length === 1) {
      // 点击在单个元素上时
      // 设置排序按钮的禁用,在shapeList中越靠后，层级越高
      CONTEXT_MENU.forEach((i) => {
        if (i.type === 'paste') {
          i.disabled = !this.copyCells.length;
          return;
        }
        i.disabled = ['layout', 'align'].includes(i.type);
      });
      const sortMenus: any = CONTEXT_MENU.find((i) => i.type === 'sort');
      sortMenus.children.forEach((menu: any) => {
        const { type } = menu;
        menu.disabled = this.sortDisabled(type);
      });
    } else {
      // 当前有多个选择，点击在多个选择上
      CONTEXT_MENU.forEach((i) => {
        if (i.type === 'paste') {
          return (i.disabled = !this.copyCells.length);
        }
        if (i.type === 'sort') return (i.disabled = true);
        i.disabled = false;
      });
    }
  }
  hiddenMenu() {
    this.menu.style.display = 'none';
  }
  showMenu() {
    const { stage, menu } = this;
    menu.style.display = 'block';
    const containerRect = stage.container().getBoundingClientRect();
    menu.style.top =
      containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    menu.style.left =
      containerRect.left + stage.getPointerPosition().x + 4 + 'px';
  }

  /** 操作 */
  del() {
    this.currentCells.forEach(({ id }) => {
      const ids = this.shapeList.map((i) => i.id);
      const index = ids.indexOf(id);
      this.shapeList.splice(index, 1);
    });
    this.$store.commit('setCurrentCells', []);
  }
  forward() {
    this.alignSortService.forward();
  }
  backward() {
    this.alignSortService.backward();
  }
  top() {
    this.alignSortService.top();
  }
  bottom() {
    this.alignSortService.bottom();
  }
  sortDisabled(type: string) {
    return this.alignSortService.getSortDisabled(type);
  }
  cut() {
    this.copy();
    this.del();
  }
  copy() {
    this.copyCells = _.cloneDeep(this.currentCells);
  }
  paste() {
    const copyedCells: any[] = [];
    this.copyCells.forEach((cell) => {
      // 每次粘贴计算id,并增大copyCell的x,y
      const { x, y } = cell;
      cell.x = x + PASTE_X_OFFSET;
      cell.y = y + PASTE_Y_OFFSET;
      const id = String(getListMaxId(this.shapeList) + 1); // knova中的id必须是字符串
      const copyedCell = { ...cell, id };
      copyedCells.push(copyedCell);
      this.shapeList.push(copyedCell);
      this.transformService.forceUpdate();
    });
    // 粘贴后同时选中复制项
    this.$store.commit('setCurrentCells', copyedCells);
  }
  save() {
    this.headerRef && this.headerRef.save();
  }
  preview() {
    this.headerRef && this.headerRef.preview();
  }
  selectAll() {
    this.$store.commit('setCurrentCells', [...this.shapeList]);
  }
  move(direction: 'up' | 'down' | 'left' | 'right') {
    this.anchorPointsService.remove();
    this.transformService.isMoving(true);
    const diff = 2;
    this.currentCells.forEach((cell) => {
      switch (direction) {
        case 'up':
          cell.y -= diff;
          break;
        case 'down':
          cell.y += diff;
          break;
        case 'left':
          cell.x -= diff;
          break;
        case 'right':
          cell.x += diff;
      }
    });
  }
  search() {
    this.emit(this.COMPONENT_METHOD.formDialogOpen, null, 'search');
  }
  left() {
    this.alignSortService.left();
  }
  horizontal() {
    this.alignSortService.horizontal();
  }
  right() {
    this.alignSortService.right();
  }
  up() {
    this.alignSortService.up();
  }
  vertical() {
    this.alignSortService.vertical();
  }
  down() {
    this.alignSortService.down();
  }
  layoutHorizontal() {
    this.alignSortService.layoutHorizontal();
  }
  layoutVertical() {
    this.alignSortService.layoutVertical();
  }

  $refs!: {
    menu: any;
  };
}
