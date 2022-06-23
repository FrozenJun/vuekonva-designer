<template>
  <el-autocomplete
    class="base-autocomplete"
    ref="BaseAutocomplete"
    v-model="model"
    v-bind="bindConfig"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <!-- SLOTS -->
    <template v-for="(name, slot) in Config.slots || {}" #[slot]>
      <slot :name="name"></slot>
    </template>
    <template v-for="(_, slot) in $scopedSlots" #[slot]>
      <slot :name="slot"></slot>
    </template>
  </el-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BASE_AUTOCOMPLETE_DEFAULT_CONFIG } from './BaseAutocomplete.default';
import defaultsDeep from 'lodash/defaultsDeep';
import FromComponentFactory from '@/core/factory/component-form.factory';
import { BaseAutocompleteAdapter } from './BaseAutocomplete.adapter';

@Component({})
export default class BaseAutocomplete extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseAutocompleteAdapter;
  get Config(): BaseAutocompleteAdapter {
    return defaultsDeep(this.config, BASE_AUTOCOMPLETE_DEFAULT_CONFIG);
  }
  get slots() {
    return this.Config.slots || {};
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-autocomplete) {
  width: 100%;
}
</style>
