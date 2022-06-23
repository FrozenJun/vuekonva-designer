<template>
  <el-button
    class="base-button"
    ref="CoButton"
    v-if="visable"
    v-bind="bindConfig"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <slot>{{ Config.text || '' }}</slot>
  </el-button>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { ButtonAdapter, ButtonOutput } from './BaseButton.adapter';
import { BUTTON_DEFAULT } from './BaseButton.default';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { ElementUIComponentSize } from 'element-ui/types/component';
import { ButtonType } from 'element-ui/types/button';
import { BaseComponent, COMPONENT_TYPE } from '@/core/dtos/factories.dto';
import { COMPONENT_CONFIG } from '@/config/component.config';

@Component({ name: 'CoButton' })
export default class BaseButton extends Mixins(BaseComponentFactory)
  implements BaseComponent {
  @Prop({ type: Object }) config!: ButtonAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  @Prop({ type: String }) size?: ElementUIComponentSize;
  @Prop({ type: String }) type?: ButtonType;
  @Prop({ type: Boolean, default: undefined }) plain?: boolean;
  @Prop({ type: Boolean, default: undefined }) round?: boolean;
  @Prop({ type: Boolean, default: undefined }) disabled?: boolean;
  @Prop({ type: Boolean, default: undefined }) loading?: boolean;
  @Prop({ type: Boolean, default: undefined }) autofocus?: boolean;
  @Prop({ type: String }) icon?: string;
  @Prop({ type: String }) nativeType?: string;

  get Config(): ButtonAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.button)
      .defaultsDeep(BUTTON_DEFAULT)
      .assign(this.$$props)
      .value();
  }

  get visable() {
    const { hasPermission, permissionName, visable } = this.Config;
    if (hasPermission && permissionName) {
      return visable && hasPermission(permissionName);
    }
    return visable;
  }

  get output(): ButtonOutput {
    return {
      config: this.Config
    };
  }

  $$type = COMPONENT_TYPE.button;
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-button) {
}
</style>
