import { Prop, Watch, Component, Vue, Inject } from 'vue-property-decorator';
import { FormComponentBase } from '../dtos/factories.dto';
import BaseComponentFactory from './component-base.factory';

@Component({})
export default class FromComponentFactory extends BaseComponentFactory {
  @Inject({ from: 'provider', default: () => {} }) provider: any;

  @Prop({ type: [String, Number, Array, Date, Boolean, Object] }) value!: any;

  @Watch('value', { immediate: true })
  onValueChanged(this: FormComponentBase & this, val: any, oldVal: any) {
    this.model = val;
    _.isFunction((this as any).onModelChange) &&
      (this as any).onModelChange(val, oldVal);
    !this.overrideModelChange &&
      this.Config.on &&
      _.isFunction(this.Config.on.modelChange) &&
      this.Config.on.modelChange(val, oldVal);
  }

  /**
   * 对model使用immediate: true会导致input事件过早触发验证
   */
  @Watch('model')
  onModelChanged(val: any, oldVal: any) {
    if (val !== oldVal) this.$emit('input', val);
  }

  model: any = null;

  mounted(this: FormComponentBase & this) {
    this.setComponentRef(this.$refs[this.$options.name!] as Vue, this.Config);
  }
}
