<template>
  <base-tabs
    class="comp-tabs"
    :config="Config.tabs"
    inner
    @output-change="copyOutputsToTarget('tabsOutputs', $event)"
    v-on="$listeners"
  >
    <slot
      v-for="item in tabPanesIncludeSlot"
      :name="item.slot"
      :slot="item.slot"
    ></slot>
  </base-tabs>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import { CompTabsAdapter } from './CompTabs.adapter';
import { COMP_TABS_DEFAULT_CONFIG } from './CompTabs.default';
import defaultsDeep from 'lodash/defaultsDeep';
import { COMPONENT_CONFIG } from '@/config/component.config';
import BaseTabs from '../../../base/tabs/src/BaseTabs.vue';
import { BaseTabsOutput } from '../../../base/tabs/src/BaseTabs.adapter';

@Component({
  name: 'CompTabs',
  components: {
    BaseTabs
  }
})
export default class CompTabs extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) tabsConfig!: CompTabsAdapter;
  get Config(): CompTabsAdapter {
    return defaultsDeep(
      this.tabsConfig,
      COMPONENT_CONFIG.tabs,
      COMP_TABS_DEFAULT_CONFIG
    );
  }
  get output(): BaseTabsOutput {
    return this.tabsOutputs;
  }
  get tabPanesIncludeSlot() {
    return this.Config.tabs.tabPanes.filter((i) => i.slot);
  }

  type = COMPONENT_TYPE.tabs;
  tabsOutputs: BaseTabsOutput = {};
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-tabs) {
}
</style>
