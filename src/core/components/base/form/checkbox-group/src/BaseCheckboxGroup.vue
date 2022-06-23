<template>
  <el-checkbox-group
    class="base-checkbox-group"
    v-model="model"
    v-bind="Config"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <el-checkbox
      v-for="(checkbox, index) in Config.checkboxs"
      :key="index"
      v-bind="checkbox"
      >{{ checkbox.text }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseCheckboxGroupAdapter } from './BaseCheckboxGroup.adapter';
import { BASE_CHECKBOX_GROUP_DEFAULT_CONFIG } from './BaseCheckboxGroup.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({})
export default class BaseCheckboxGroup extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseCheckboxGroupAdapter;
  get Config(): BaseCheckboxGroupAdapter {
    return defaultsDeep(this.config, BASE_CHECKBOX_GROUP_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-checkbox-group) {
}
</style>
