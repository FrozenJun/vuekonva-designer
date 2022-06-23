import { Component, Watch, Vue } from 'vue-property-decorator';
import CoreFactory from './core.factory';
import { BaseComponent } from '../dtos/factories.dto';
import { FactoryService } from '../service/factory.service';
import { BASE_ADAPTER_KEYS } from '../dtos/component-base.dto';

@Component({})
export default class BaseComponentFactory extends CoreFactory {
  /**
   * 随机生成20位数字的组件id,作为该组件的唯一标识,用于注销组件
   */
  get cid() {
    return Math.floor(Math.random() * Math.pow(10, 20)).toString();
  }

  /**
   * 组件名称，用于区分同一页面中多个相同组件
   */
  get id(this: BaseComponent & this) {
    return this.compName || this.Config.name || '';
  }

  /**
   * $props过滤config, name, inner和值为undefined的属性，防止没有设置时也覆盖config配置
   */
  get $$props() {
    return _(this.$props)
      .omitBy(_.isUndefined)
      .omit('config', 'name', 'inner')
      .value();
  }

  /**
   * v-bind的config需要过滤一些不会是组件prop的属性
   */
  get bindConfig(this: BaseComponent & this) {
    return _(this.Config)
      .omit(BASE_ADAPTER_KEYS)
      .value();
  }

  /**
   * 内部组件output改变时emit output-change 事件，
   * 用户使用组件output改变时更新注册的output信息
   * @param output 组件的对外输出
   */
  @Watch('output', { immediate: true })
  onOutputChange(this: BaseComponent & this, output: any) {
    output &&
      (this.inner ? this.$emit('output-change', output) : this.register());
  }

  mounted(this: BaseComponent & this) {
    !this.inner && this.register();
    this.setComponentRef(this.$refs[this.$options.name!] as Vue, this.Config);
    this.Config.styles && this.setStyleNamesToComponent(this.Config.styles);
  }
  beforeDestroy(this: BaseComponent & this) {
    !this.inner && this.logout();
  }

  /**
   * 注册组件
   */
  register(this: BaseComponent & this) {
    FactoryService.register({
      cid: this.cid,
      name: this.id,
      type: this.$$type,
      output: this.output || {}
    });
  }

  /**
   * 注销组件
   */
  logout() {
    FactoryService.logout(this.cid);
  }
}
