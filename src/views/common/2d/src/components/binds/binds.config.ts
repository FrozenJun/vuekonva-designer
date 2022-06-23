import { Component, Watch } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto';
import { TabsAdapter } from '@/core/components/base/tabs/src/BaseTabs.adapter';
import { CompFormAdapter } from '@/core/components/customize/form/src/CompForm.adapter';
import { State } from 'vuex-class';
import { RecordService, FontService } from '../../services';
import { StageDataContent } from '../../utils/2d.dto';
import {
  FONT_STYLE_ICONS,
  FONT_ALIGN_ICONS
} from '../../constants/font.constant';
import {
  STAGE_TABPANES,
  CELL_TABPANES,
  CELL_NOBIND_TABPANES
} from '../../constants/tab.constant';
import {
  LINE_FORM,
  LINE_BIND_FORM,
  IMAGE_FORM,
  IMAGE_BIND_FORM,
  TEXT_FORM,
  CIRCLE_FORM,
  RECT_FORM,
  CANVAS_FORM,
  EMPTY_TAB_FORM,
  POLYLINE_FORM
} from '../../constants/form.constant';

@Component({})
export class BsBindsConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;
  FONT_STYLE_ICONS = FONT_STYLE_ICONS;
  FONT_ALIGN_ICONS = FONT_ALIGN_ICONS;

  @State('recordService') recordService!: RecordService;
  @State('fontService') fontService!: FontService;
  @State('content') Content!: StageDataContent;
  @State('currentCells') currentCells!: any[];

  @Watch('currentCells', { immediate: true })
  async onCurrentCellsChange(cells?: any[]) {
    if (!cells || !cells.length || cells.length > 1) {
      this.tabs.model = 'canvas';
      this.tabs.tabPanes = STAGE_TABPANES;
      return;
    }
    const cell = cells[0];
    if (!cell) return;
    this.tabs.model = cell.tab || 'attr';
    await this.resetTabs();
    this.tabs.tabPanes = cell.binds ? CELL_TABPANES : CELL_NOBIND_TABPANES;
    switch (cell.type) {
      case 'arrow':
        this.attrTab = {
          form: cell.name === '直线' ? LINE_FORM : POLYLINE_FORM,
          formModel: cell
        };
        this.bindTab = { form: LINE_BIND_FORM, formModel: cell.binds };
        break;
      case 'image':
        this.attrTab = { form: IMAGE_FORM, formModel: cell };
        this.bindTab = { form: IMAGE_BIND_FORM, formModel: cell.binds };
        break;
      case 'text':
        this.attrTab = { form: TEXT_FORM, formModel: cell };
        break;
      case 'textarea':
        this.attrTab = { form: TEXT_FORM, formModel: cell };
        break;
      case 'circle':
        this.attrTab = { form: CIRCLE_FORM, formModel: cell };
        break;
      case 'rect':
        this.attrTab = { form: RECT_FORM, formModel: cell };
    }
  }

  get currentCell() {
    return this.currentCells && this.currentCells.length === 1
      ? this.currentCells[0]
      : null;
  }

  tabs: TabsAdapter = {
    model: 'canvas',
    type: 'card',
    tabPanes: STAGE_TABPANES,
    on: {
      tabClick: (tab) => {
        const vm = this.getThis();
        if (!vm.currentCell) return;
        vm.currentCell.tab = tab.name;
      }
    }
  };

  get canvasTab(): CompFormAdapter {
    return {
      form: CANVAS_FORM,
      formModel: this.Content.canvas
    };
  }

  attrTab: CompFormAdapter = EMPTY_TAB_FORM;
  bindTab: CompFormAdapter = EMPTY_TAB_FORM;

  mounted() {
    this.getModelTreeAndSetTreeData();
  }

  // 监听按键事件，并阻止向上传播，防止删除，后退，前后左右等影响页面的按键被用户无意识按下
  onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
  }

  // 当前画布组件选择的模型ID
  get modelId() {
    return this.bindTab.formModel.model || '';
  }
  get warnContent() {
    const warn = this.bindTab.formModel.warn;
    if (!warn) return '请先选择提醒规则';
    const type = warn.associationType === 1 ? '状态' : '性能';
    const rule = warn.warnParamList
      .map((i: any) => `${i.judgingCondition} ${i.threshold}`)
      .join(` ${warn.logicalRelation} `);
    return `${type}：${warn.associationName}\r\n 规则：${rule}`;
  }

  /**
   * 字体相关
   */
  setFontStyle(type: string) {
    this.fontService.setFontStyle(type);
  }
  setFontAlign(type: string) {
    this.fontService.setFontAlign(type);
  }

  /**
   * 添加告警 && 添加成功后的回调
   */
  addWarn() {
    if (!this.modelId) return;
    this.emit(this.COMPONENT_METHOD.addEditDialogOpen, undefined, 'warn');
  }
  async addWarnSuccess() {
    const warnItem: any = this.getFormItem('cellFunc.bindTab.form', 'warn');
    if (!warnItem) return;
    warnItem.selectConfig.options.disableParamsCache = true;
    await warnItem.selectConfig.options.send();
    warnItem.selectConfig.options.disableParamsCache = false;
  }

  // modeltree数据是不变的，这里统一调一次接口去获取
  // 防止每次点击模型都要去获取一次
  async getModelTreeAndSetTreeData() {
    // const res = await BsModelTreeApi.treeList();
    return;
    const BIND_FORMS = [LINE_BIND_FORM, IMAGE_BIND_FORM];
    BIND_FORMS.forEach((form) => {
      const model = _.find(_.get(form, 'formItems', []), {
        modelName: 'model'
      });
      model!.treeSelectConfig!.tree.data = res;
    });
  }
  // 修复直接赋值会导致formItem slot有时显示不了的bug
  async resetTabs() {
    this.tabs.tabPanes = [];
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
