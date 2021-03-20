import { TrendTableApi } from './../../../app/api/trend-table.api';
import Vue from 'vue';
import {
  BaseFormItemAdapter,
  BaseFormItemType
} from '@/core/components/base/form/form-item/src/BaseFormItem.adapter';

export class Common {
  // 新增编辑动态数据
  relationSettingArr: any[] = [];
  // 解析列表数据
  currentCloums: any = [];
  listArr: any[] = [];
  arrComponentIds = ['4', '6', '12', '13', '14', '15'];
  timeArrComponentIds = ['12', '13'];

  // 动态表单类型
  async formType(
    item: any,
    type: string,
    formMoudle: any
  ): Promise<BaseFormItemAdapter | undefined> {
    let res: any[] = [];
    // 查询字典数据
    if (item.dictCode) {
      res =
        (await TrendTableApi.getSearchCode({
          dictCode: item.dictCode,
          enabled: 1
        })) || [];
    }
    switch (item.componentId) {
      case '1': {
        const rule1 = `pos_int|max_value:${item.rangeMax}|min_value:${item.rangeMin}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule1}`
              : rule1,
          inputConfig: {
            type: 'number',
            step: '1',
            placeholder: item.description,
            maxlength: item.length,
            max: item.rangeMax,
            min: item.rangeMin
          }
        };
      }
      case '2': {
        const rule2 = `max_value:${item.rangeMax}|min_value:${item.rangeMin}|digits:${length}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule2}`
              : rule2,
          inputConfig: {
            type: 'number',
            placeholder: item.description,
            maxlength: item.length,
            max: item.rangeMax,
            min: item.rangeMin
          }
        };
      }
      case '3':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          raidoConfig: {
            raidos: res.map((i) => {
              return {
                text: i.label,
                label: i.content,
                disabled: false
              };
            })
          }
        };
      case '4':
        if (type === 'search') {
          Vue.set(formMoudle, item.code, []);
        } else {
          Vue.set(formMoudle, item.code, []);
        }
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          checkboxGroupConfig: {
            checkboxs: res.map((i) => {
              return {
                text: i.label,
                label: i.content,
                disabled: false,
                checked: false
              };
            })
          }
        };
      case '5':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          selectConfig: {
            options: res.map((i) => {
              return {
                label: i.label,
                value: i.content
              };
            })
          }
        };
      case '6':
        if (type === 'search') {
          Vue.set(formMoudle, item.code, []);
        }
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          selectConfig: {
            multiple: true,
            options: res.map((i) => {
              return {
                label: i.label,
                value: i.content
              };
            })
          }
        };
      case '7': {
        const rule7 = `max:${item.length}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule7}`
              : rule7,
          inputConfig: {
            placeholder: item.description,
            maxlength: item.length
          }
        };
      }
      case '8': {
        const rule8 = `max:${item.length}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule8}`
              : rule8,
          inputConfig: {
            type: 'textarea',
            placeholder: item.description,
            maxlength: item.length
          }
        };
      }
      case '9': {
        const rule9 = `max:${item.length}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule9}`
              : rule9,
          inputConfig: {
            type: 'password',
            placeholder: item.description,
            maxlength: item.length
          }
        };
      }
      case '10':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          datetimeConfig: {
            type: 'date',
            placeholder: item.description,
            valueFormat: 'yyyy-MM-dd'
          }
        };
      case '11':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          datetimeConfig: {
            type: 'datetime',
            placeholder: item.description,
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        };
      case '12':
        if (type === 'search') {
          Vue.set(formMoudle, item.code, []);
        }
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          datetimeConfig: {
            type: 'daterange',
            placeholder: item.description,
            valueFormat: 'yyyy-MM-dd'
          }
        };
      case '13':
        if (type === 'search') {
          Vue.set(formMoudle, item.code, []);
        }
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          datetimeConfig: {
            type: 'datetimerange',
            placeholder: item.description,
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        };
      case '14':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          uploadConfig: {
            // action: `${API_CONFIG.apiPrefixUrl} + /file/upload`,
            multiple: item.upLimit !== 1,
            accept: 'image/png, image/gif, image/jpeg, image/jpg, image/bmp',
            disabled: false,
            limit: item.upLimit
          }
        };
      case '15':
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule: item.isRequired === 1 && type !== 'search' ? 'required' : '',
          uploadConfig: {
            // action: `${API_CONFIG.apiPrefixUrl} + /file/upload`,
            multiple: item.upLimit !== 1,
            type: 'file',
            accept:
              'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.ms-powerpoint, audio/mpeg, audio/mp4, video/mp4, application/pdf, aplication/zip, text/plain',
            disabled: false,
            limit: item.upLimit
          }
        };
      case '16': {
        const rule16 = `max:${item.length}`;
        return {
          label: item.name,
          modelName: item.code,
          type: this.formItemType[item.componentId],
          labelWidth: item.name.length >= 5 ? '120px' : '',
          rule:
            item.isRequired === 1 && type !== 'search'
              ? `required|${rule16}`
              : rule16,
          slots: {
            append: 'relationSetting'
          },
          inputConfig: {
            placeholder: item.description,
            maxlength: item.length
          }
        };
      }
    }
  }

  // 查询搜索字段
  async getSearchPrams(id: string, searchConfig: any) {
    const res: any = await TrendTableApi.getSearch({
      deviceId: id
    });
    if (!res) return;
    const searchItem: any = [];
    res.map(async (item: any) => {
      const searchFormModle = searchConfig.formModel;
      Vue.set(searchFormModle, item.code, null);
      const formItem = await this.formType(item, 'search', searchFormModle);
      if (formItem) {
        item.isSelect === 1 && searchItem.push(formItem);
      }
    });
    searchConfig.form.formItems = searchItem;
  }

  // 新增编辑
  async getAddEditForm(id: string, addEditDialogConfig: any) {
    const res: any = await TrendTableApi.addeditForm({
      deviceId: id
    });
    if (!res) return;
    const addEditItem: any = [];
    const settingArr: any = [];
    res.map((item: any) => {
      item.attributes.map(async (itemChild: any) => {
        const addEditFormMoudle = addEditDialogConfig.formModel;
        Vue.set(addEditFormMoudle, itemChild.code, null);
        const formItem = await this.formType(itemChild, '', addEditFormMoudle);
        if (formItem) {
          addEditItem.push(formItem);
          // 关联关系才会有的一层数据
          itemChild.attributeRels.map((i: any) => {
            if (i.deviceType) {
              i.deviceType.value = [];
              settingArr.push(i.deviceType);
            }
          });
        }
      });
    });
    this.relationSettingArr = settingArr;
    addEditDialogConfig.form.formItems = addEditItem;
  }

  // 获取列表title
  async getListTitle(id: string, gridConfig: any) {
    const res: any = await TrendTableApi.listTitle({
      deviceId: id,
      isView: 1
    });
    if (!res) return;
    this.getTitleGroup(res, gridConfig);
  }
  // 满足查看不调接口直接拿数据
  async getTitleGroup(res: any, gridConfig: any) {
    const cloums: any = [];
    this.listArr = await Promise.all(
      res.map(async (item: any) => {
        // 表头查询字典数据
        cloums.push({
          label: item.name,
          prop:
            item.dictCode || this.arrComponentIds.includes(item.componentId)
              ? `${item.code}Name`
              : item.code
        });
        if (item.dictCode) {
          // 查询字典数据
          const resDict: any = await TrendTableApi.getSearchCode({
            dictCode: item.dictCode,
            enabled: 1
          });
          if (resDict) item.dictList = resDict;
        }
        return item;
      })
    );
    gridConfig.table.columns = cloums.concat(this.currentCloums);
  }

  // 解析表格数据
  analysisTable(data: any) {
    this.listArr.forEach((i) => {
      // 将value值通过数据字典获取展示的值
      if (data[i.code] && i.dictList) {
        if (data[i.code] instanceof Array) {
          // 如果value是一个数组
          data[`${i.code}Name`] = data[i.code]
            .map((j: string) => {
              const res = i.dictList.find((n: any) => n.content === j);
              return res ? res.label : '';
            })
            .join(',');
        } else {
          // 如果value不是一个数组
          const res = i.dictList.find((n: any) => n.content === data[i.code]);
          data[`${i.code}Name`] = res ? res.label : '';
        }
      } else if (data[i.code] instanceof Array) {
        // 如果value不需要查询数据字典同时是个数组
        if (this.timeArrComponentIds.includes(i.componentId)) {
          // 如果是时间段的数组
          data[`${i.code}Name`] = data[i.code].join(' -- ');
        } else {
          // 如果是非时间段的数组
          data[`${i.code}Name`] = data[i.code].join(',');
        }
      }
    });
  }

  // 类型集合
  formItemType: {
    [k: string]: BaseFormItemType;
  } = {
    1: 'input', // 整数输入框
    2: 'input', // 小数输入框
    3: 'raido', // 单选框
    4: 'checkboxGroup', // 复选框
    5: 'select', //下拉单选
    6: 'select', //下拉多选
    7: 'input', //单行文本输入框
    8: 'input', //多行文本输入框
    9: 'input', //密码输入框
    10: 'datetime', //日期输入框
    11: 'datetime', //时间输入框
    12: 'datetime', //日期区间输入框
    13: 'datetime', //时间区间输入框
    14: 'upload', //上传图片
    15: 'upload', //上传文件
    16: 'input' //关联关系类型
  };
}
