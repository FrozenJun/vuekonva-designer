<template>
  <base-tree
    class="comp-tree"
    :config="Config.tree"
    inner
    @output-change="copyOutputsToTarget('treeOutputs', $event)"
  >
    <template v-for="(_, slot) in $scopedSlots" #[slot]="{node, data}">
      <slot :name="slot" :node="node" :data="data"></slot>
    </template>
  </base-tree>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import { CompTreeAdapter } from './CompTree.adapter';
import { COMP_TREE_DEFAULT_CONFIG } from './CompTree.default';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import { COMPONENT_CONFIG } from '@/config/component.config';
import BaseTree from '@/core/components/base/tree';
import { BaseTreeOutput } from 'src/core/components/base/tree/src/BaseTree.adapter';

@Component({
  name: 'CompTree',
  components: {
    BaseTree
  }
})
export default class CompTree extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) treeConfig!: CompTreeAdapter;
  get Config(): CompTreeAdapter {
    return defaultsDeep(
      this.treeConfig,
      COMPONENT_CONFIG.tree,
      COMP_TREE_DEFAULT_CONFIG
    );
  }
  get output(): BaseTreeOutput {
    return this.treeOutputs;
  }

  type = COMPONENT_TYPE.tree;
  treeOutputs: BaseTreeOutput = {};
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-tree) {
}
</style>
