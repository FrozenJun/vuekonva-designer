<template>
  <el-color-picker
    class="base-color-picker"
    ref="BaseColorPicker"
    v-model="model"
    v-bind="Config"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  ></el-color-picker>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseColorPickerAdapter } from './BaseColorPicker.adapter';
import { BASE_COLOR_PICKER_DEFAULT_CONFIG } from './BaseColorPicker.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({})
export default class BaseColorPicker extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseColorPickerAdapter;
  get Config(): BaseColorPickerAdapter {
    return defaultsDeep(this.config, BASE_COLOR_PICKER_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-color-picker) {
  // 默认的inline-block会导致el-form-item__content异常的增高16px
  display: block;
}
</style>
