<template>
  <el-radio-group
    v-model="model"
    class="base-raido"
    v-bind="Config"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <el-radio
      v-for="(raido, index) in Config.raidos"
      :key="index"
      v-bind="raido"
      >{{ raido.text }}</el-radio
    >
  </el-radio-group>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseRaidoAdapter } from './BaseRaido.adapter';
import { BASE_RAIDO_DEFAULT_CONFIG } from './BaseRaido.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({})
export default class BaseRaido extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseRaidoAdapter;
  get Config(): BaseRaidoAdapter {
    return defaultsDeep(this.config, BASE_RAIDO_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-raido) {
}
</style>
