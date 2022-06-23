<template>
  <el-tree
    class="base-tree"
    ref="CoTree"
    v-bind="Config"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
    :data="data"
    :defaultCheckedKeys="defaultCheckedKeys"
    v-loading="Config.data && Config.data.loading"
  >
    <template v-for="(name, slot) in Config.slots || {}" #[slot]="{node, data}">
      <slot :name="name" :node="node" :data="data"></slot>
    </template>
    <template v-for="(_, slot) in $scopedSlots" #[slot]="{node, data}">
      <slot :name="slot" :node="node" :data="data"></slot>
    </template>
  </el-tree>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { BaseTreeAdapter, BaseTreeOutput } from './BaseTree.adapter';
import { BASE_TREE_DEFAULT_CONFIG } from './BaseTree.default';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import isArray from 'lodash/isArray';
import { TreeData } from 'element-ui/types/tree';
import { AsyncData } from '@/core/dtos/component.dto';

@Component({
  name: 'CoTree'
})
export default class BaseTree extends Mixins(BaseComponentFactory) {
  @Prop({ type: Object }) config!: BaseTreeAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): BaseTreeAdapter {
    return defaultsDeep(this.config, BASE_TREE_DEFAULT_CONFIG);
  }
  get output(): BaseTreeOutput {
    return {
      getData: this.getData.bind(this),
      getCheckedKeys: this.getCheckedKeys.bind(this)
    };
  }

  @Watch('Config.data', { immediate: true })
  onData(data: TreeData[] | AsyncData<TreeData>) {
    if (isArray(data)) {
      this.data = data;
    } else {
      data.immediate && this.getData();
      data.send = this.getData;
      data.set = (d: any) => {
        this.data = d;
      };
      if (data.providerName && !data.providerRegisterOpt) {
        this.asyncDataRegister(data);
      }
    }
  }

  @Watch('Config.defaultCheckedKeys', { immediate: true })
  onDefaultCheckedKeys(
    data: (number | string)[] | AsyncData<(number | string) | undefined>
  ) {
    if (isArray(data)) {
      this.defaultCheckedKeys = data;
    } else if (data) {
      data.immediate && this.getCheckedKeys();
      data.send = this.getCheckedKeys;
      data.set = (d: any) => {
        this.defaultCheckedKeys = d;
      };
      if (data.providerName && !data.providerRegisterOpt) {
        this.asyncDataRegister(data);
      }
    }
  }

  data: TreeData[] = [];
  defaultCheckedKeys: (string | number)[] = [];

  async getData() {
    const data = this.Config.data as AsyncData<TreeData>;
    if (this.data.length && !data.disableCache) return;
    const res = (await this.getAsyncData(data)) || [];
    if (!res) return;
    this.data = res;
    setTimeout(() => {
      data.afterSend && data.afterSend(data, this);
    }, 0);
  }

  async getCheckedKeys() {
    const keys = this.Config.defaultCheckedKeys;
    if (!keys || _.isArray(keys)) return;
    if (this.defaultCheckedKeys.length && !keys.disableCache) return;
    this.defaultCheckedKeys = (await this.getAsyncData(keys)) || [];
    setTimeout(() => {
      keys.afterSend && keys.afterSend(keys, this);
    }, 0);
  }

  beforeDestroy() {
    const { data, defaultCheckedKeys } = this.Config;
    if (!_.isArray(data)) {
      this.asyncDataLogout(data);
    }
    if (defaultCheckedKeys && !_.isArray(defaultCheckedKeys)) {
      this.asyncDataLogout(defaultCheckedKeys);
    }
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-tree) {
}
</style>
