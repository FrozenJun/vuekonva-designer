import { COMPONENT_TYPE } from './../dtos/factories.dto';
import { BaseFormItemAdapter } from './../components/base/form/form-item/src/BaseFormItem.adapter';
import { AsyncData } from '@/core/dtos/component.dto';
import { ELEMENT_UI_CONFIG } from './../dtos/element-ui.dto';
import { Component, Vue } from 'vue-property-decorator';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import { dasherize, camelize } from '../utils/base/strings';
import { COMPONENT_METHOD, COMPONENT_DATA } from '../dtos/factories.dto';
import { FactoryService } from '../service/factory.service';
import { dasherizeKeys } from '../utils/base/object';
import isUndefined from 'lodash/isUndefined';
import defaultsDeep from 'lodash/defaultsDeep';
import { FormAdapter } from '../components/base/form/form/src/BaseForm.adapter';
import { BaseFormItemType } from '../components/base/form/form-item/src/BaseFormItem.adapter';
import { CancelTokenService } from '../service/cancel-token.service';

type listener = Function | Function[] | undefined;

@Component({})
export default class CoreFactory extends Vue {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;

  /**
   * 触发组件提供的方法
   * @param methodName 触发组件方法的名称
   * @param preload 传递给方法的数据
   * @param componentName 组件的名称，默认’‘
   */
  emit(methodName: COMPONENT_METHOD, preload?: any, componentName = '') {
    FactoryService.emit(methodName, preload, componentName);
  }

  /**
   * 接收组件提供的数据
   * @param dataName 接受组件数据的名称
   * @param componentName 组件的名称，默认''
   * @param isGetAllMatchData 是否返回全部匹配的数据，默认false
   */
  reveice(
    dataName: COMPONENT_DATA,
    componentName = '',
    isGetAllMatchData = false
  ) {
    return FactoryService.reveice(dataName, componentName, isGetAllMatchData);
  }

  /**
   * 配合async/await,使函数一直等待，直到val存在
   * 不要传入一个非引用变量，否则永远不会存在
   ``` javascript
   await waitUnitResultTrue(() => this.$el) // 等待直到vue绑定dom完成
   ```
   @param handleFunction 处理函数，一直等待直到handleFunction返回true
   */
  async waitUnitResultTrue(handleFunction: (...args: any[]) => boolean) {
    let maxTime = (10 * 1000) / 100; // 10s
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        maxTime--;
        if (handleFunction()) {
          clearInterval(interval);
          resolve();
        }
        if (maxTime < 0) {
          clearInterval(interval);
        }
      }, 100);
    });
  }

  /**
   * 将source（output）复制给名为targetName的变量
   * @param targetName 赋值source数据的变量名称
   * @param source change事件传递出来的数据
   */
  copyOutputsToTarget(
    this: any,
    targetName: string,
    source: { [k: string]: any }
  ) {
    if (this[targetName]) {
      this[targetName] = cloneDeep(source);
    }
  }

  /**
   * emit名为emitName的事件并执行监听函数
   * listenerName请使用驼峰写法
   * emitName为listenerName的短横线写法
   * @param listenerName 监听函数的名称
   * @param listenerFuncs 包含所以监听函数的集合，如 this.Config.on / this.Config.events
   * @param args 传入给监听函数的参数
   */
  emitEventAndExecuteListener(
    listenerName: string,
    listenerFuncs: undefined | { [k: string]: listener },
    ...args: any[]
  ) {
    listenerName = camelize(listenerName);
    const emitName = dasherize(listenerName);
    this.$emit(emitName, ...args);
    this.executeListenerIfExist(listenerName, listenerFuncs, ...args);
  }

  /**
   * 执行名为listenerName的监听函数
   * @param listenerName 监听函数的名称
   * @param listenerFuncs 包含所以监听函数的集合，如 this.Config.on / this.Config.events
   * @param args 传入给监听函数的参数
   */
  executeListenerIfExist(
    listenerName: string,
    listenerFuncs: undefined | { [k: string]: listener },
    ...args: any[]
  ) {
    if (listenerFuncs) {
      Object.keys(listenerFuncs).forEach((listenerFunc) => {
        if (listenerFunc === listenerName) {
          const listeners = listenerFuncs[listenerFunc];

          if (typeof listeners === 'function') {
            listeners!.apply(this, args);
          } else if (isArray(listeners)) {
            listeners
              .filter((listener) => typeof listener === 'function')
              .forEach((listener) => listener!.apply(this, args));
          }
        }
      });
    }
  }

  /**
   * 返回一个v-on的对象
   * 合并listeners中的监听函数，并忽略ignoreEventNames中的事件
   * @param listeners 包含监听函数对象的数组
   * @param ignoreEventNames 忽略监听事件的名称数组
   */
  mergeEventsAndDasherizeKeys(
    listeners: ({ [k: string]: any } | undefined)[],
    ignoreEventNames?: string[]
  ) {
    const target: { [k: string]: any } = {};
    listeners
      .map((listener) => dasherizeKeys(listener))
      .forEach((listener) => {
        Object.keys(listener).forEach((key) => {
          const argFun = listener[key];
          if (target[key] && typeof target[key] === 'function') {
            target[key] = [target[key], argFun];
          } else if (
            target[key] &&
            Reflect.toString.call(target[key]) === '[object Array]'
          ) {
            target[key] = [...target[key], argFun];
          } else {
            target[key] = argFun;
          }
        });
      });
    if (ignoreEventNames) {
      ignoreEventNames
        .map((event) => dasherize(event))
        .forEach((event) => {
          Reflect.deleteProperty(target, event);
        });
    }
    // 为所有回调函数绑定当前vue实例的this
    _.forOwn(target, (value, key) => {
      if (_.isArray(value)) {
        target[key] = value.map((i: any) => i.bind(this));
      } else {
        target[key] = value.bind(this);
      }
    });
    return target;
  }

  /**
   * 返回配置中的slotName的对象的值的数组
   * @param config 带有slot配置对象的config配置
   * @param slotName slot对象的名称
   */
  getConfigSlotsValueList(
    config: { [k: string]: any } | { [k: string]: any }[],
    slotName = 'slots'
  ) {
    if (isArray(config)) {
      const target: any[] = [];
      config.forEach((item: any) => {
        if (item && item[slotName]) {
          Object.keys(item[slotName]).forEach((i) =>
            target.push(item[slotName][i])
          );
        }
      });
      return target;
    } else if (config && config[slotName]) {
      return Object.keys(config[slotName]).map((i) => config[slotName][i]);
    } else {
      return [];
    }
  }

  UI_CONFIGS = {
    element: ELEMENT_UI_CONFIG
  };
  /**
   * 过滤attrs中的属性，使其能直接v-bind至第三方ui组件
   * @param attrs config对象
   * @param attrField 需要过滤的UI组件名称
   * @param uiConfig UI配置对象
   */
  filterAttrsForVBind(
    attrs: { [k: string]: any },
    attrField: string,
    uiConfig: any = this.UI_CONFIGS.element.attrFields
  ) {
    if (!uiConfig[attrField]) return attrs;
    const target: { [k: string]: any } = {};
    Object.keys(attrs)
      .filter((key) => {
        return !!uiConfig[attrField].includes(key);
      })
      .forEach((key) => {
        target[key] = attrs[key];
      });
    return target;
  }

  /**
   * 将配置的styles数组加入到组件根节点的class中
   * ```javascript
   * setStyleNamesToComponent(['underline']) // Config.styles = ['underline']
   * <div class="comp-** comp-**--underline"></div> // 浏览器中的**组件dom
   * ```
   * @param styleNameList 需要生效的样式名称列表
   */
  setStyleNamesToComponent(styleNameList: string[] = []) {
    const componentClassName = dasherize(this.$options.name || '');
    styleNameList.forEach((styleName) => {
      this.$el.classList.add(
        styleName.includes(componentClassName) ? styleName : `is-${styleName}`
      );
    });
  }

  /**
   * 将组件的引用赋给config中的ref字段
   * @param ref 组件ref对象
   * @param config 配置对象
   */
  setComponentRef(ref: Vue | undefined, config: { [k: string]: any }) {
    if (!ref || isUndefined(config.ref)) return;
    config.ref = ref;
  }

  /**
   * 异步获取类型AsyncData的数据
   * @param data 类型为AsyncData的数据
   */
  async getAsyncData(metaData: AsyncData): Promise<any> {
    const data: AsyncData = defaultsDeep(metaData, {
      loading: true
    });
    // 如果c存在，说明之前调的接口未结束，执行c()可以abort之前的接口请求
    if (data.c && !data.disableAbort) data.c();
    // 真正传给Api的参数，有时候params并不是最后的参数，比如表格还要带额外的查询，分页参数
    if (!data._sendParams) {
      data._sendParams = data.paramsGetter ? data.paramsGetter() : data.params;
    }
    if (
      !data.disableParamsCache &&
      !_.isUndefined(data._sendParams) &&
      data._sendParams === data._oldParams
    ) {
      data._sendParams = undefined;
      return;
    }
    data.loading = true;
    const api = data.api(data._sendParams);
    /**
     * CancelTokenService.set前不要有await操作，否则会导致canceler不一致的问题
     */
    data.c = CancelTokenService.get();
    const res = await api;
    data._oldParams = data._sendParams;
    data._sendParams = undefined;
    data.c = undefined;
    data.loading = false;
    if (!res) return;
    data.data = res;
    if (data.handleKey && data.handleData) {
      const meta = _.get(data.data, data.handleKey, []);
      if (data.handleEach && _.isArray(meta)) {
        const target = await Promise.all(meta.map(data.handleData));
        _.set(data.data, data.handleKey, target);
      } else {
        const target = await data.handleData(meta);
        _.set(data.data, data.handleKey, target);
      }
    } else if (data.handleData) {
      data.data = data.handleData(res);
    }
    return data.data;
  }

  asyncDataRegister(metaData: AsyncData) {
    const cid = Math.floor(Math.random() * Math.pow(10, 20)).toString();
    const name = metaData.providerName || '';
    const type = COMPONENT_TYPE.asyncData;
    const setParams = (params: any) => {
      if (_.isFunction(params)) {
        metaData.params = params(metaData.params);
      } else {
        metaData.params = params;
      }
    };
    const output = {
      send: (params: any) => {
        setParams(params);
        metaData.send && metaData.send();
      },
      setData: metaData.set,
      setParams
    };
    metaData.providerRegisterOpt = { cid, name, type, output };
    FactoryService.register(metaData.providerRegisterOpt);
  }
  asyncDataLogout(metaData: AsyncData) {
    if (metaData.providerRegisterOpt) {
      FactoryService.logout(metaData.providerRegisterOpt.cid);
      metaData.providerRegisterOpt = undefined;
    }
  }

  /**
   * 检测数组中是否存在某元素，并返回当前数组
   * arr 需要检测比对的数组源
   * param 比对的参数
   * key   原始源中参与比对参数
   */
  arrHasElem(arr: object[], param: string, key = 'modelName') {
    if (!isArray(arr) || !key || !param) {
      this.$message({ type: 'warning', message: 'arrHasElem检测方法出错' });
      return;
    }
    const result: any = arr.filter((item: any) => {
      return item[key] == param;
    });
    if (result.length > 1) {
      console.log('为了避免意外，请保证arrHasElem方法中key对应的值唯一');
      return [];
    }
    return result;
  }

  /**
   * 返回from中名称为modelName的item
   * @param form 表单form配置
   * @param modelName 需要返回的modelName
   */
  getFormItemByModelName(form: FormAdapter, modelName: string) {
    return form.formItems.find((i) => i.modelName === modelName);
  }
  /**
   * 返回from中类型为type的item
   * @param form 表单form配置
   * @param type 需要返回的type，默认input
   */
  getFormItemByType(form: FormAdapter, type: BaseFormItemType = 'input') {
    return form.formItems.filter((i) => (i.type || 'input') === type);
  }

  /**
   * 返回from中名称为modelName的item
   * ```javascript
   * getFormItem('searchConfig.form', 'test') // {modelName: 'test'}
   * searchConfig = {
   *   form: {
   *     formItems: [{modelName: 'test'}]
   *   }
   * }
   * ```
   * @param path 表单form path
   * @param modelName 需要返回的modelName
   */
  getFormItem(path: string, modelName: string): BaseFormItemAdapter {
    return _.find(_.get(this, `${path}.formItems`, []), { modelName });
  }

  get(path: string, defaultValue?: any) {
    return _.get(this, path, defaultValue);
  }
  set(path: string, value: any) {
    return _.set(this, path, value);
  }
}
