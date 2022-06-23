<template>
  <el-table
    class="base-table"
    ref="CoTable"
    v-loading="Config.data.loading"
    element-loading-spinner="el-icon-loading"
    :element-loading-text="Config.loadingText"
    :data="tableData"
    v-bind="filterAttrsForVBind(Config, 'table')"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
  >
    <el-table-column
      v-if="Config.showSelection"
      type="selection"
      width="55"
      :selectable="Config.selectable"
      :reserveSelection="Config.reserveSelection"
    ></el-table-column>

    <el-table-column
      v-if="Config.showNo"
      align="center"
      label="序号"
      prop="baseTableNo"
      width="55"
    ></el-table-column>

    <template v-for="(item, index) in Config.columns">
      <!-- DEFAULT - 默认 -->
      <el-table-column
        v-if="item.columnType === 'default'"
        :key="index"
        v-bind="filterAttrsForVBind(item, 'tableColumn')"
      ></el-table-column>
      <!-- BUTTONS - 按钮 -->
      <el-table-column
        v-else-if="item.columnType === 'button'"
        :key="index"
        v-bind="filterAttrsForVBind(item, 'tableColumn')"
        class-name="base-table__buttons"
        :width="item.width || getButtonWidth(item.buttonConfig.buttons)"
      >
        <template #default="scope">
          <base-button
            v-for="(button, num) in getButtons(
              item.buttonConfig.buttons,
              item.buttonConfig.handleEachButton,
              scope
            )"
            :key="num"
            :config="button"
            @click.native="button.onClick(scope, button)"
            inner
          ></base-button>
        </template>
      </el-table-column>
      <!-- ICON - 带icon -->
      <el-table-column
        v-else-if="item.columnType === 'icon'"
        :key="index"
        v-bind="filterAttrsForVBind(item, 'tableColumn')"
        class-name="base-table__icon"
      >
        <template slot-scope="scope">
          <div class="base-table__icon-container">
            <i
              :class="[
                item.iconConfig.handleInjectIcon(scope.row),
                {
                  'base-table__icon-left': item.iconConfig.position === 'left'
                },
                {
                  'base-table__icon-right': item.iconConfig.position === 'right'
                }
              ]"
            ></i>
            <span v-if="item.iconConfig.showProp">{{
              scope.row[item.prop]
            }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- SLOT -->
      <el-table-column
        v-else-if="item.columnType === 'slot' && item.slotConfig"
        :key="index"
        v-bind="filterAttrsForVBind(item, 'tableColumn')"
      >
        <template #default="scope">
          <slot
            v-if="item.slotConfig.slot"
            :name="item.slotConfig.slot"
            :scope="scope"
          ></slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import {
  BaseTableAdapter,
  BaseTableOutput,
  BaseTableButtonConfig
} from './BaseTable.adapter';
import {
  BASE_TABLE_DEFAULT_CONFIG,
  BASE_TABLE_COLUMN_DEFAULT_CONFIG,
  BASE_TABLE_OPERATION_DEFAULT
} from './BaseTable.default';
import defaultsDeep from 'lodash/defaultsDeep';
import isArray from 'lodash/isArray';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import BaseButton from '../../button/src/BaseButton.vue';
import Vue from 'vue';
import { AsyncData } from '@/core/dtos/component.dto';

@Component({
  name: 'CoTable',
  components: {
    BaseButton
  }
})
export default class BaseTable extends Mixins(BaseComponentFactory) {
  @Prop({ type: Object }) config!: BaseTableAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): BaseTableAdapter {
    defaultsDeep(this.config, BASE_TABLE_DEFAULT_CONFIG);
    this.config.columns.forEach((column) => {
      defaultsDeep(column, BASE_TABLE_COLUMN_DEFAULT_CONFIG);
      column.buttonConfig &&
        column.buttonConfig.buttons.forEach((button) => {
          defaultsDeep(button, BASE_TABLE_OPERATION_DEFAULT);
        });
    });
    return this.config as BaseTableAdapter;
  }
  get pagination() {
    return this.Config.pagination || {};
  }

  getButtons(
    buttons: BaseTableButtonConfig[],
    handle: Function | undefined,
    scope: any
  ) {
    const buttonsCopy = _.cloneDeep(buttons).map((i) => Vue.observable(i));
    return handle ? handle(buttonsCopy, scope) : buttonsCopy;
  }
  getButtonWidth(buttons: BaseTableButtonConfig[]) {
    // 为loading预留1 10px
    // 一个1字按钮或者icon按钮默认66px(基础 + margin)
    // 1字以上每加一个字12px（即字体大小）
    let base = 20;
    _.isArray(buttons) &&
      buttons.forEach((button) => {
        base += 36 + (button.text ? (button.text.length - 1) * 12 : 0);
      });
    return base;
  }

  // 监听dataMeta的整个的改变
  @Watch('Config.data', { immediate: true })
  onDataMetaChange(data: any[] | AsyncData<any>, oldData: any) {
    if (data === oldData) return; // 疑惑？有时这种情况watch函数还是会触发，比如改变table里的其它值
    if (isArray(data)) {
      // 空数组变成另一个空数组不算改变
      this.tableMetaData = data;
      this.total = data.length;
    } else {
      const dataKey = this.pagination.enable
        ? this.pagination.dataKey
        : undefined;
      _.defaultsDeep(data, {
        disableCache: true,
        immediate: true,
        handleKey: dataKey,
        handleEach: true
      });
      // 直接执行pageNo,pageSize不存在
      data.immediate && setTimeout(this.getData, 0);
      data.send = this.getData;
      data.set = (d: any) => {
        this.tableMetaData = d;
      };
      if (data.providerName && !data.providerRegisterOpt) {
        this.asyncDataRegister(data);
      }
    }
  }

  tableMetaData: any[] = [];
  total = 0;
  responseData: { [name: string]: any } = {};
  get output(): BaseTableOutput {
    return {
      total: this.total,
      update: this.getData.bind(this),
      responseData: this.responseData
    };
  }
  get tableData() {
    const processData = this.Config.handleDataList
      ? this.Config.handleDataList(this.tableMetaData)
      : this.tableMetaData;
    return this._dataAddNo(this._dataPaging(processData)).map(
      this._dataHandleDeep
    );
  }

  async getData() {
    const data = this.Config.data as AsyncData<any[]>;
    if (this.tableMetaData.length && !data.disableCache) return;
    data._sendParams = {
      ...data.params,
      ...this.Config.searchParam
    };
    if (this.pagination.enable) {
      _.assign(data._sendParams, {
        [this.pagination.noKey!]: this.pagination.page || 1,
        [this.pagination.sizeKey!]: this.pagination.pageSize || 10
      });
    }
    const res = (await this.getAsyncData(data)) || [];
    if (!res) return;
    // TODO - 待删除
    this.responseData = res;
    this.$emit('updated');
    if (this.pagination.enable) {
      this.tableMetaData = _.get(res, this.pagination.dataKey!, []);
      this.total = _.get(
        res,
        this.pagination.totalKey!,
        this.tableMetaData.length || 0
      );
    } else {
      this.tableMetaData = data.handleKey
        ? _.get(res, data.handleKey, [])
        : res;
      this.total = this.tableMetaData.length || 0;
    }
    setTimeout(() => {
      data.afterSend && data.afterSend(data, this);
    }, 0);
  }

  private _dataPaging(data: any[]) {
    if (!this.pagination.enable || !this.pagination.paginationBySelf)
      return data;
    const { page = 1, pageSize = 10 } = this.pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }
  private _dataAddNo(data: any[]) {
    if (!this.Config.showNo) return data;
    const { page = 1, pageSize = 10 } = this.pagination;
    return data.map((i, index) => {
      i.baseTableNo = index + 1 + (page - 1) * pageSize;
      return i;
    });
  }
  private _dataHandleDeep(data: { [k: string]: any }) {
    const handleFunction = this.Config.handleData;
    if (handleFunction) {
      data = handleFunction(data);
      if (this.Config.isDeepHandle && data.children && data.children.length) {
        data.children = data.children.map(this._dataHandleDeep);
      }
    }
    return data;
  }

  beforeDestroy() {
    if (!_.isArray(this.Config.data)) {
      this.asyncDataLogout(this.Config.data);
    }
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-table) {
  @include e(icon-container) {
    display: inline-flex;
    @include layout-align(center, center);
    i {
      font-size: 14px;
      line-height: 1;
      padding: 2px;
    }
    @include e(icon-left) {
      margin-right: 5px;
    }
    @include e(icon-right) {
      margin-left: 5px;
      order: 2;
    }
  }
}
</style>
