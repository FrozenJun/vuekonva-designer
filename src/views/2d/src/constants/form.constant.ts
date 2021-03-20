import store from '@/store';
import { CompFormAdapter } from '@/core/components/customize/form/src/CompForm.adapter';
import { FormAdapter } from '@/core/components/base/form/form/src/BaseForm.adapter';
import { BsTaskDefineTaskAddEditApi } from '@/views/functional-service/task-operation/src/components/tabs/components/task-define/components/task-add-edit/task-add-edit.api';
import { BsTabsWarnApi } from '@/views/configuration/model-management/src/components/tabs/components/warn/warn.api';
import { waitUnitResultTrue } from '@/core/utils/common/tools';

// chagne事件触发时，记录+1
const RECORD_OPERATE = () => {
  store.state.recordService.add && store.state.recordService.add();
};
const RECORD_ON_CHANGE = {
  change() {
    RECORD_OPERATE();
  }
};

/**
 * FORM - tabpanes中的form配置
 */
export const EMPTY_TAB_FORM: CompFormAdapter = {
  form: {
    formItems: []
  },
  formModel: {}
};
export const CANVAS_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '80px',
  labelPosition: 'left',
  formItems: [
    {
      label: '画布',
      type: 'empty'
    },
    {
      type: 'empty',
      width: '5%'
    },
    {
      label: '宽',
      modelName: 'width',
      labelWidth: '30px',
      width: '45%',
      inputConfig: {
        type: 'number',
        min: '0',
        on: {
          change() {
            RECORD_OPERATE();
            // 宽高改变后重新计算缩放比例
            store.state.zoomService.computedZoomValue();
          }
        }
      }
    },
    {
      type: 'empty',
      width: '5%'
    },
    {
      label: '高',
      modelName: 'height',
      labelWidth: '30px',
      width: '45%',
      inputConfig: {
        type: 'number',
        min: '0',
        on: {
          change() {
            RECORD_OPERATE();
            // 宽高改变后重新计算缩放比例
            store.state.zoomService.computedZoomValue();
          }
        }
      }
    },
    {
      label: '背景',
      type: 'empty'
    },
    {
      label: '填充颜色',
      labelWidth: '80px',
      modelName: 'background',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const LINE_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'right',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      model.pointerLength = model.pointerWidth;
      model.hitStrokeWidth = model.strokeWidth > 20 ? model.strokeWidth : 20;
    }
  },
  formItems: [
    {
      label: '样式',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '图标名',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '颜色',
      modelName: 'stroke',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '线宽',
      modelName: 'strokeWidth',
      type: 'inputNumber',
      inputNumberConfig: {
        size: 'small',
        min: 1,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '短划线类型',
      modelName: 'dashEnabled',
      type: 'raido',
      raidoConfig: {
        raidos: [{ text: '直线', label: false }, { text: '虚线', label: true }],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '起点带箭头',
      modelName: 'pointerWidth',
      type: 'checkbox',
      checkboxConfig: {
        trueLabel: 10,
        falseLabel: 0,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '两端带箭头',
      modelName: 'pointerAtBeginning',
      type: 'checkbox',
      checkboxConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '填充颜色',
      modelName: 'fill',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const POLYLINE_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'right',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      model.pointerLength = model.pointerWidth;
      model.hitStrokeWidth = model.strokeWidth > 20 ? model.strokeWidth : 20;
      // 折点数改变，对应改变points的长度
      const diff = model.points.length - model.polylinePoints * 2 - 4;
      if (diff !== 0) {
        const endX = model.points[model.points.length - 2];
        const endY = model.points[model.points.length - 1];
        if (diff > 0) {
          // 删除多余的points
          model.points.splice(model.polylinePoints * 2 + 2);
          model.points.push(endX, endY);
        } else {
          // 等分最后一个折点和端点的距离以满足折点数
          const addPointsNumber = Math.abs(diff) / 2;
          model.points.splice(model.points.length - 2);
          const endPolylineX = model.points[model.points.length - 2];
          const endPolylineY = model.points[model.points.length - 1];
          const spacingX = (endX - endPolylineX) / (addPointsNumber + 1);
          const spacingY = (endY - endPolylineY) / (addPointsNumber + 1);
          addPointsNumber &&
            new Array(addPointsNumber).fill(null).forEach((i) => {
              model.points.push(endPolylineX + spacingX);
              model.points.push(endPolylineY + spacingY);
            });
          model.points.push(endX);
          model.points.push(endY);
        }
        // 更新视图
        store.state.anchorPointsService.update();
        store.state.layer.getNode().draw();
      }
    }
  },
  formItems: [
    {
      label: '样式',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '图标名',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '颜色',
      modelName: 'stroke',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '线宽',
      modelName: 'strokeWidth',
      type: 'inputNumber',
      inputNumberConfig: {
        size: 'small',
        min: 1,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '折点数',
      modelName: 'polylinePoints',
      type: 'inputNumber',
      inputNumberConfig: {
        size: 'small',
        min: 1,
        max: 3,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '短划线类型',
      modelName: 'dashEnabled',
      type: 'raido',
      raidoConfig: {
        raidos: [{ text: '直线', label: false }, { text: '虚线', label: true }],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '起点带箭头',
      modelName: 'pointerWidth',
      type: 'checkbox',
      checkboxConfig: {
        trueLabel: 10,
        falseLabel: 0,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '两端带箭头',
      modelName: 'pointerAtBeginning',
      type: 'checkbox',
      checkboxConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '填充颜色',
      modelName: 'fill',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const LINE_BIND_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'left',
  labelPosition: 'left',
  on: {
    formModelChange(formModel, oldModel) {
      const { model, device, warnType } = formModel;
      const { model: oModel, device: oDevice } = oldModel;
      // 获取device下拉列表
      const items = _.get(LINE_BIND_FORM, 'formItems', []);
      const deviceItem: any = _.find(items, { modelName: 'device' });
      const warn: any = _.find(items, { modelName: 'warn' });
      const warnRule: any = _.find(items, { modelName: 'warnRule' });
      const warnColor: any = _.find(items, { modelName: 'warnColor' });

      if (model && model !== oModel) {
        itemEnableAndSend(deviceItem, model);
        itemEnableAndSend(warn, model);
        if (device === oDevice) {
          // 据此判断为当前为选择类型的操作,而不是编辑,情况设备名称的值
          formModel.device = '';
          formModel.warn = null;
        }
      }

      if (!model) {
        deviceItem.selectConfig.disabled = true;
        formModel.device = '';
        warn.selectConfig.disabled = true;
        formModel.warn = null;
      }

      if (warnType) {
        warn.visible = true;
        warnRule.visible = true;
        warnColor.visible = true;
      } else {
        warn.visible = false;
        warnRule.visible = false;
        warnColor.visible = false;
      }
    }
  },
  formItems: [
    {
      label: '实体',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '类型',
      modelName: 'model',
      type: 'treeSelect',
      treeSelectConfig: {
        label: '',
        valueKey: 'id',
        input: {
          clearable: true,
          placeholder: '请选择',
          on: RECORD_ON_CHANGE
        },
        tree: {
          ref: null,
          data: [],
          nodeKey: 'id',
          props: {
            label: 'name',
            children: 'list'
          }
        }
      }
    },
    {
      label: '设备名称',
      modelName: 'device',
      type: 'select',
      selectConfig: {
        disabled: true,
        options: {
          api: BsTaskDefineTaskAddEditApi.getHandleObj,
          params: {},
          disableCache: true,
          disableAbort: true,
          handleData(data) {
            return data.list.map((i: any) => {
              return {
                label: i.name,
                value: i.id
              };
            });
          }
        },
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '提醒方式',
      modelName: 'warnType',
      type: 'select',
      selectConfig: {
        options: [
          {
            label: '闪烁',
            value: 1
          },
          {
            label: '高亮',
            value: 2
          }
        ],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '提醒规则',
      modelName: 'warn',
      visible: false,
      type: 'select',
      selectConfig: {
        disabled: true,
        valueKey: 'id',
        options: {
          api: BsTabsWarnApi.list,
          params: {},
          disableAbort: true,
          disableCache: true,
          disableParamsCache: false,
          handleData(data) {
            return data.records.map((i: any) => {
              return {
                label: i.name,
                value: i, // 因为要展示告警规则拼接字段，value取整个对象
                id: i.id
              };
            });
          }
        },
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '告警规则',
      type: 'slot',
      modelName: 'warnRule',
      visible: false,
      slotConfig: {
        name: 'warnContent'
      }
    },
    {
      label: '颜色',
      modelName: 'warnColor',
      type: 'colorPicker',
      visible: false,
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const TEXT_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '80px',
  itemContentAlign: 'right',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      const textItem = TEXT_FORM.formItems.find((i) => i.modelName === 'text');
      textItem!.inputConfig!.type = model.type;

      model.offsetX = model.width / 2;
      model.offsetY = model.height / 2;
    }
  },
  formItems: [
    {
      label: '样式',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '图标名',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '文本内容',
      modelName: 'text',
      inputConfig: {
        type: 'text',
        rows: 3,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '宽',
      labelWidth: '80px',
      modelName: 'width',
      type: 'inputNumber',
      inputNumberConfig: {
        min: 10,
        size: 'small',
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '高',
      labelWidth: '80px',
      modelName: 'height',
      type: 'inputNumber',
      inputNumberConfig: {
        min: 10,
        size: 'small',
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '字体',
      modelName: 'fontFamily',
      type: 'select',
      selectConfig: {
        clearable: false,
        options: [
          {
            label: '微软雅黑',
            value: '微软雅黑'
          },
          {
            label: '宋体',
            value: '宋体'
          },
          {
            label: '仿宋',
            value: '仿宋'
          }
        ],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '字号',
      modelName: 'fontSize',
      type: 'select',
      selectConfig: {
        clearable: false,
        options: [
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '22', value: 22 },
          { label: '24', value: 24 },
          { label: '28', value: 28 },
          { label: '32', value: 32 },
          { label: '48', value: 48 },
          { label: '64', value: 64 }
        ],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '字体颜色',
      modelName: 'fill',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '字体样式',
      type: 'slot',
      slotConfig: {
        name: 'fontStyle'
      }
    },
    {
      label: '对齐',
      type: 'slot',
      slotConfig: {
        name: 'fontAlign'
      }
    }
  ]
};

export const IMAGE_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '80px',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      model.offsetX = model.width / 2;
      model.offsetY = model.height / 2;
    }
  },
  formItems: [
    {
      label: '设备',
      type: 'empty'
    },
    {
      label: '图标名',
      labelWidth: '80px',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const CIRCLE_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'right',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      model.offsetX = model.width / 2;
      model.offsetY = model.height / 2;
    }
  },
  formItems: [
    {
      label: '样式',
      type: 'empty'
    },
    {
      label: '图标名',
      labelWidth: '80px',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '颜色',
      modelName: 'stroke',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '线宽',
      modelName: 'strokeWidth',
      type: 'inputNumber',
      inputNumberConfig: {
        size: 'small',
        min: 1,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '短划线类型',
      modelName: 'dashEnabled',
      type: 'raido',
      raidoConfig: {
        raidos: [{ text: '直线', label: false }, { text: '虚线', label: true }],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '填充颜色',
      modelName: 'fill',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const RECT_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'right',
  labelPosition: 'left',
  on: {
    formModelChange(model) {
      model.offsetX = model.width / 2;
      model.offsetY = model.height / 2;
    }
  },
  formItems: [
    {
      label: '样式',
      type: 'empty'
    },
    {
      label: '图标名',
      labelWidth: '80px',
      modelName: 'name',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '颜色',
      modelName: 'stroke',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '线宽',
      modelName: 'strokeWidth',
      type: 'inputNumber',
      inputNumberConfig: {
        size: 'small',
        min: 1,
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '短划线类型',
      modelName: 'dashEnabled',
      type: 'raido',
      raidoConfig: {
        raidos: [{ text: '直线', label: false }, { text: '虚线', label: true }],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '填充颜色',
      modelName: 'fill',
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

export const IMAGE_BIND_FORM: FormAdapter = {
  itemWidth: '100%',
  labelWidth: '90px',
  itemContentAlign: 'left',
  labelPosition: 'left',
  on: {
    formModelChange(formModel, oldModel) {
      const { model, device, warnType } = formModel;
      const { model: oModel, device: oDevice } = oldModel;
      // 获取device下拉列表
      const items = _.get(IMAGE_BIND_FORM, 'formItems', []);
      const deviceItem: any = _.find(items, { modelName: 'device' });
      const warnRule: any = _.find(items, { modelName: 'warnRule' });
      const warnColor: any = _.find(items, { modelName: 'warnColor' });

      if (model && model !== oModel) {
        itemEnableAndSend(deviceItem, model);
        if (device === oDevice) {
          // 据此判断为当前为选择类型的操作,而不是编辑,情况设备名称的值
          formModel.device = '';
        }
      }

      if (!model) {
        deviceItem.selectConfig.disabled = true;
        formModel.device = '';
      }

      if (warnType) {
        warnRule.visible = true;
        warnColor.visible = true;
      } else {
        warnRule.visible = false;
        warnColor.visible = false;
      }
    }
  },
  formItems: [
    {
      label: '连接',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '链接标题',
      modelName: 'linkTitle',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '链接地址',
      modelName: 'linkUrl',
      inputConfig: {
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '实体',
      labelWidth: '80px',
      type: 'empty'
    },
    {
      label: '类型',
      modelName: 'model',
      type: 'treeSelect',
      treeSelectConfig: {
        label: '',
        valueKey: 'id',
        input: {
          clearable: true,
          placeholder: '请选择',
          on: RECORD_ON_CHANGE
        },
        tree: {
          ref: null,
          data: [],
          nodeKey: 'id',
          props: {
            label: 'name',
            children: 'list'
          }
        }
      }
    },
    {
      label: '设备名称',
      modelName: 'device',
      type: 'select',
      selectConfig: {
        disabled: true,
        options: {
          api: BsTaskDefineTaskAddEditApi.getHandleObj,
          params: {},
          disableCache: true,
          disableAbort: true,
          handleData(data) {
            return data.list.map((i: any) => {
              return {
                label: i.name,
                value: i.id
              };
            });
          }
        },
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '展示样式',
      type: 'slot',
      slotConfig: {
        name: 'showText'
      }
    },
    {
      label: '提醒方式',
      modelName: 'warnType',
      type: 'select',
      selectConfig: {
        options: [
          {
            label: '闪烁',
            value: 1
          },
          {
            label: '高亮',
            value: 2
          }
        ],
        on: RECORD_ON_CHANGE
      }
    },
    {
      label: '告警规则',
      type: 'slot',
      modelName: 'warnRule',
      visible: false,
      slotConfig: {
        name: 'warnText'
      }
    },
    {
      label: '颜色',
      modelName: 'warnColor',
      visible: false,
      type: 'colorPicker',
      colorPickerConfig: {
        showAlpha: true,
        on: RECORD_ON_CHANGE
      }
    }
  ]
};

async function itemEnableAndSend(item: any, model: string) {
  item.selectConfig.disabled = false;
  item.selectConfig.options.params = {
    pageSize: 9999,
    deviceId: model
  };
  await waitUnitResultTrue(() => item.selectConfig.options.send);
  item.selectConfig.options.send();
}
