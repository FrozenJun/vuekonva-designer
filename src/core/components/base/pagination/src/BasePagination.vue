<template>
  <el-pagination
    class="base-pagination"
    ref="CoPagination"
    v-bind="filterAttrsForVBind(Config, 'pagination')"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
    :current-page.sync="page"
    :page-size="pageSize"
  ></el-pagination>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  PaginationAdapter,
  BasePaginationOutput
} from './BasePagination.adapter';
import { PAFINATION_DEFAULT } from './BasePagination.default';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { COMPONENT_CONFIG } from '@/config/component.config';
import { COMPONENT_TYPE } from '@/core/dtos/factories.dto';

@Component({ name: 'CoPagination' })
export default class BasePagination extends Mixins(BaseComponentFactory) {
  @Prop({ type: Object }) config!: PaginationAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): PaginationAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.pagination, PAFINATION_DEFAULT)
      .value();
  }

  page = this.Config.currentPage || 1;
  pageSize = this.Config.pageSize || 10;
  get output(): BasePaginationOutput {
    return {
      page: this.page,
      pageSize: this.pageSize,
      resetPage: this.resetPage.bind(this)
    };
  }

  onSizeChange(size: number) {
    this.pageSize = size;
  }
  onCurrentChange(currentPage: number) {
    this.page = currentPage;
  }

  resetPage(page: number) {
    this.page = page;
    this.emitEventAndExecuteListener('resetPage', this.Config.on, page);
  }

  $$type = COMPONENT_TYPE.pagination;
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-pagination) {
}
</style>
