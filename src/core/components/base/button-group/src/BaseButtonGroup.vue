<template>
  <el-button-group
    class="base-button-group"
    ref="CoButtonGroup"
    v-bind="bindConfig"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <slot>
      <base-button
        v-for="(button, index) in Config.buttons"
        :key="index"
        :config="button"
        inner
      ></base-button>
    </slot>
  </el-button-group>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  ButtonGroupAdapter,
  ButtonGroupOutput
} from './BaseButtonGroup.adapter';
import { BUTTON_GROUP_DEFAULT } from './BaseButtonGroup.default';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { BaseComponent, COMPONENT_TYPE } from '@/core/dtos/factories.dto';
import { COMPONENT_CONFIG } from '@/config/component.config';
import BaseButton from '../../button/src/BaseButton.vue';
import { removeClass } from '@/core/utils/dom/class';

@Component({
  name: 'CoButtonGroup',
  components: {
    BaseButton
  }
})
export default class BaseButtonGroup extends Mixins(BaseComponentFactory)
  implements BaseComponent {
  @Prop({ type: Object }) config!: ButtonGroupAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): ButtonGroupAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.buttonGroup, BUTTON_GROUP_DEFAULT)
      .value();
  }

  get output(): ButtonGroupOutput {
    return {
      config: this.Config
    };
  }

  $$type = COMPONENT_TYPE.buttonGroup;

  mounted() {
    this.Config.margin && removeClass(this.$el as any, 'el-button-group');
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';
@import './__styles__/operation.scss';

@include b(base-button-group) {
}
</style>
