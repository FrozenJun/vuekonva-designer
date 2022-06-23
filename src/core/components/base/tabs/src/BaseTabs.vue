<template>
  <el-tabs
    class="base-tabs"
    ref="CoTabs"
    v-model="Config.model"
    v-bind="filterAttrsForVBind(Config, 'tabs')"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
    @tab-click="onTabClick"
  >
    <el-tab-pane
      v-for="(item, index) in tabPanes"
      :key="index"
      v-bind="filterAttrsForVBind(item, 'tabPane')"
    >
      <slot v-if="item.slot" :name="item.slot"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { TabsAdapter, BaseTabsOutput } from './BaseTabs.adapter';
import { TABS_DEFAULT } from './BaseTabs.default';
import { BaseTabsActiveBarFunc } from './BaseTabs.support';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { COMPONENT_TYPE, BaseComponent } from '@/core/dtos/factories.dto';
import { COMPONENT_CONFIG } from '@/config/component.config';

@Component({ name: 'CoTabs' })
export default class BaseTabs extends Mixins(BaseComponentFactory)
  implements BaseComponent {
  @Prop({ type: Object }) config!: TabsAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): TabsAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.tabs)
      .defaultsDeep(TABS_DEFAULT)
      .value();
  }

  get tabPanes() {
    const { tabPanes, hasPermission } = this.Config;
    return tabPanes.filter(({ permissionName }) => {
      if (hasPermission && permissionName) return hasPermission(permissionName);
      return true;
    });
  }

  get output(): BaseTabsOutput {
    return {
      setTab: this.setCurrentTab.bind(this)
    };
  }

  $$type = COMPONENT_TYPE.tabs;
  activeBarFunc = new BaseTabsActiveBarFunc();

  setCurrentTab(newTabName: string) {
    this.Config.model = newTabName;
  }

  onTabClick() {
    setTimeout(() => {
      this.activeBarFunc.setScale(this.Config.activeTabScale, this.$el);
    }, 0);
  }

  mounted() {
    this.activeBarFunc.setScale(this.Config.activeTabScale, this.$el);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-tabs) {
}
</style>
