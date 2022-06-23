<template>
  <el-date-picker
    class="base-datetime"
    ref="BaseDatetime"
    v-model="model"
    v-bind="filterAttrsForVBind(Config, 'datetime')"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <template v-for="(name, slot) in Config.slots || {}" #[slot]>
      <slot :name="name"></slot>
    </template>
    <template v-for="(_, slot) in $scopedSlots" #[slot]>
      <slot :name="slot"></slot>
    </template>
  </el-date-picker>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import { BASE_DATETIME_DEFAULT_CONFIG } from './BaseDatetime.default';
import { BaseDatetimeAdapter } from './BaseDatetime.adapter';

@Component({})
export default class BaseDatetime extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseDatetimeAdapter;
  get Config(): BaseDatetimeAdapter {
    return defaultsDeep(this.config, BASE_DATETIME_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-datetime) {
  &.el-input {
    width: 100%;
  }
}
</style>
