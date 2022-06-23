<template>
  <div class="base-switch">
    <el-switch
      class="base-switch__switch"
      ref="BaseSwitch"
      v-bind="Config"
      v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
      v-model="model"
    ></el-switch>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseSwitchAdapter } from './BaseSwitch.adapter';
import { BASE_SWITCH_DEFAULT_CONFIG } from './BaseSwitch.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({})
export default class BaseSwitch extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseSwitchAdapter;
  get Config(): BaseSwitchAdapter {
    return defaultsDeep(this.config, BASE_SWITCH_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-switch) {
}
</style>
