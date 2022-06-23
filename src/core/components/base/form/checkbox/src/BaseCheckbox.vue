<template>
  <el-checkbox
    class="base-checkbox"
    ref="CoCheckbox"
    v-model="model"
    v-bind="Config"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
    >{{ text || Config.text }}</el-checkbox
  >
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { CheckboxAdapter } from './BaseCheckbox.adapter';
import { CHECKBOX_DEFAULT } from './BaseCheckbox.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import { COMPONENT_TYPE } from '@/core/dtos/factories.dto';
import { COMPONENT_CONFIG } from '@/config/component.config';
import { ElementUIComponentSize } from 'element-ui/types/component';

@Component({ name: 'CoCheckbox' })
export default class BaseCheckbox extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: CheckboxAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  @Prop({ type: String }) text?: string;
  @Prop({ type: String }) name?: string;
  @Prop({ type: String }) size?: ElementUIComponentSize;
  @Prop({ type: [String, Number, Boolean] }) label?: string | number | boolean;
  @Prop({ type: [String, Number] }) trueLabel?: string | number;
  @Prop({ type: [String, Number] }) falseLabel?: string | number;
  @Prop({ type: Boolean, default: undefined }) border?: boolean;
  @Prop({ type: Boolean, default: undefined }) disabled?: boolean;
  @Prop({ type: Boolean, default: undefined }) checked?: boolean;
  @Prop({ type: Boolean, default: undefined }) indeterminate?: boolean;

  get Config(): CheckboxAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.checkbox, CHECKBOX_DEFAULT)
      .assign(this.$$props)
      .value();
  }

  $$type = COMPONENT_TYPE.checkbox;
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-checkbox) {
}
</style>
