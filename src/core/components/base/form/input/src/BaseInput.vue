<template>
  <el-input
    class="base-input"
    ref="CoInput"
    v-model="model"
    v-bind="bindConfig"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <template v-for="(_, slot) in $scopedSlots" #[slot]>
      <slot :name="slot"></slot>
    </template>
    <template v-for="(name, slot) in Config.slots || {}" #[slot]>
      <slot :name="name"></slot>
    </template>
  </el-input>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import FromComponentFactory from '@/core/factory/component-form.factory';
import { INPUT_DEFAULT } from './BaseInput.default';
import { InputAdapter } from './BaseInput.adapter';
import { COMPONENT_TYPE } from '@/core/dtos/factories.dto';
import { COMPONENT_CONFIG } from '@/config/component.config';

@Component({ name: 'CoInput' })
export default class BaseInput extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: InputAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): InputAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.input)
      .defaultsDeep(INPUT_DEFAULT)
      .value();
  }

  $$type = COMPONENT_TYPE.input;
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-input) {
  position: relative;
}
</style>
