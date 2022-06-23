import { Component } from 'vue-property-decorator';
import CoreFactory from './core.factory';
import { FunctionalComponentBase } from '../dtos/component-functional.dto';

@Component({})
export default class FunctionalComponentFactory extends CoreFactory {
  /**
   * config 箭头函数中获取到vue实例的方法
   */
  getThis() {
    return this;
  }

  mounted(this: FunctionalComponentBase & this) {
    this.Config.styles && this.setStyleNamesToComponent(this.Config.styles);
  }
}
