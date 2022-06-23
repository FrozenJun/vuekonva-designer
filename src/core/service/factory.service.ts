import {
  COMPONENT_TYPE,
  COMPONENT_METHOD,
  COMPONENT_DATA,
  EmitComponentMethodConfig,
  ReceiveComponentDataConfig
} from '../dtos/factories.dto';
import cloneDeep from 'lodash/cloneDeep';

export interface ProviderItem {
  cid: string;
  name: string;
  type: COMPONENT_TYPE;
  output: { [name: string]: any };
}

class FactoryServiceClass {
  providers: ProviderItem[] = [];

  /**
   * 注册组件
   * @param provider 组件提供者
   */
  register(provider: ProviderItem) {
    provider.output = cloneDeep(provider.output);
    const oldProvider = this.providers.find(
      (item) => item.cid === provider.cid
    );
    if (oldProvider) {
      oldProvider.output = provider.output;
    } else {
      this.providers.push(provider);
    }
  }

  /**
   * 注销组件
   * @param cid 组件的id
   */
  logout(cid: string) {
    this.providers = this.providers.filter((provider) => provider.cid !== cid);
  }

  /**
   * 触发组件提供的方法
   * @param methodName 触发组件方法的名称
   * @param preload 传递给方法的数据
   * @param componentName 组件的名称，默认’‘
   */
  emit(methodName: COMPONENT_METHOD, preload?: any, componentName = '') {
    const methodConfig = EmitComponentMethodConfig[methodName];
    if (!methodConfig) return;
    const matchOutputs = this.providers.filter((provider) => {
      return (
        provider.output &&
        typeof provider.output[methodConfig.outputName] === 'function' &&
        methodConfig.type === provider.type &&
        componentName === provider.name
      );
    });
    if (matchOutputs.length) {
      matchOutputs.forEach((matchOutput) =>
        matchOutput.output[methodConfig.outputName](preload)
      );
    } else {
      console.warn(`没有匹配到${methodName}方法`);
    }
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
    const dataConfig = ReceiveComponentDataConfig[dataName];
    if (!dataConfig) return;
    const matchOutputs = this.providers.filter((provider) => {
      return (
        provider.output &&
        typeof provider.output[dataConfig.outputName] &&
        dataConfig.type === provider.type &&
        componentName === provider.name
      );
    });
    if (matchOutputs.length) {
      const outputs = matchOutputs.map(
        (matchOutput) => matchOutput.output[dataConfig.outputName]
      );
      return isGetAllMatchData ? outputs : outputs[0];
    } else {
      console.warn(`没有找到${dataName}数据`);
      return null;
    }
  }
}

export const FactoryService = new FactoryServiceClass();
