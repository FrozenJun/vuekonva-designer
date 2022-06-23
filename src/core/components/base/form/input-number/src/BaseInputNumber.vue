<template>
  <el-input-number
    class="base-input-number"
    ref="BaseInputNumber"
    v-model="model"
    v-bind="filterAttrsForVBind(Config, 'inputNumber')"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  ></el-input-number>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseInputNumberAdapter } from './BaseInputNumber.adapter';
import { BASE_INPUT_NUMBER_DEFAULT_CONFIG } from './BaseInputNumber.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({})
export default class BaseInputNumber extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseInputNumberAdapter;
  get Config(): BaseInputNumberAdapter {
    return defaultsDeep(this.config, BASE_INPUT_NUMBER_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-input-number) {
}
</style>
