import { Component } from 'vue-property-decorator';
import CoreFactory from './core.factory';

@Component({})
export default class ViewFactory extends CoreFactory {
  /**
   * config 箭头函数中获取到vue实例的方法
   */
  getThis() {
    return this;
  }
}
