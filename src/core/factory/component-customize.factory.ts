import { CustomizeComponentBase } from '../dtos/factories.dto';
import { FactoryService } from './../service/factory.service';
import { Component, Watch } from 'vue-property-decorator';
import CoreFactory from './core.factory';

@Component({})
export default class CustomizeComponentFactory extends CoreFactory {
  cid = this.initCid(); // 组件id

  get id(this: CustomizeComponentBase & this) {
    return this.Config.name || '';
  }

  @Watch('output', { immediate: true })
  onOutputChange(this: CustomizeComponentBase & this) {
    this.register(); // 输出有变化时更新组件
  }

  mounted(this: CustomizeComponentBase & this) {
    this.register();
    this.Config.styles && this.setStyleNamesToComponent(this.Config.styles);
  }
  beforeDestroy() {
    this.logout();
  }

  /**
   * 注册组件
   */
  register(this: CustomizeComponentBase & this) {
    FactoryService.register({
      cid: this.cid,
      name: this.id,
      type: this.type,
      output: this.output
    });
  }

  /**
   * 注销组件
   */
  logout() {
    FactoryService.logout(this.cid);
  }

  /**
   * 随机生成20位数字的组件id
   */
  private initCid() {
    return Math.floor(Math.random() * Math.pow(10, 20)).toString();
  }
}
