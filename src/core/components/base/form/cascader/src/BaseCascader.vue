<template>
  <div class="base-cascader">
    <el-cascader
      class="base-cascader__cascader"
      ref="BaseCascader"
      v-model="model"
      v-bind="bindConfig"
      v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
      v-if="Config.rendering"
    >
      <!-- SLOTS -->
      <template v-for="(name, slot) in Config.slots || {}" #[slot]>
        <slot :name="name"></slot>
      </template>
      <template v-for="(_, slot) in $scopedSlots" #[slot]>
        <slot :name="slot"></slot>
      </template>
    </el-cascader>
    <el-input
      v-else
      :size="Config.size"
      v-model="model"
      :disabled="Config.disabled"
      readonly
    ></el-input>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import { BaseCascaderAdapter } from './BaseCascader.adapter';
import { BASE_CASCADER_DEFAULT_CONFIG } from './BaseCascader.default';

@Component({})
export default class BaseCascader extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseCascaderAdapter;
  get Config(): BaseCascaderAdapter {
    return defaultsDeep(this.config, BASE_CASCADER_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-cascader) {
  width: 100%;

  @include e(cascader) {
    width: 100%;
  }
}
</style>
