<template>
  <div class="base-select">
    <el-select
      class="base-select__select"
      ref="BaseSelect"
      size="small"
      v-bind="bindConfig"
      v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
      :loading="Config.loading || Config.options.loading"
      v-model="model"
      @visible-change="onVisibleChange"
    >
      <template v-for="(name, slot) in Config.slots || {}" #[slot]>
        <slot :name="name"></slot>
      </template>
      <template v-for="(_, slot) in $scopedSlots" #[slot]>
        <slot :name="slot"></slot>
      </template>
      <el-option
        v-for="(option, index) in options"
        :key="index"
        v-bind="option"
      ></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import FromComponentFactory from '@/core/factory/component-form.factory';
import { BASE_SELECT_DEFAULT_CONFIG } from './BaseSelect.default';
import { BaseSelectAdapter, SelectOptions } from './BaseSelect.adapter';
import isArray from 'lodash/isArray';
import { AsyncData } from '@/core/dtos/component.dto';

@Component({})
export default class BaseSelect extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseSelectAdapter;
  get Config(): BaseSelectAdapter {
    return _(this.config)
      .defaultsDeep(BASE_SELECT_DEFAULT_CONFIG)
      .value();
  }

  options: any[] = [];

  @Watch('Config.options', { immediate: true })
  onOptionMeta(options: SelectOptions[] | AsyncData<SelectOptions>) {
    if (isArray(options)) {
      this.options = options;
    } else {
      options.immediate && this.getOpitons();
      options.send = this.getOpitons;
      options.set = (d: any) => {
        this.options = d;
      };
      if (options.providerName && !options.providerRegisterOpt) {
        this.asyncDataRegister(options);
      }
    }
  }

  onVisibleChange(visable: boolean) {
    if (
      visable &&
      !isArray(this.Config.options) &&
      this.Config.autoSendWhenVisibleTrue
    ) {
      this.getOpitons();
    }
  }

  onModelChange(v: any) {
    if (_.isArray(this.Config.options) || !this.Config.autoSendWhenModelChange)
      return;
    if (_.isArray(v)) {
      v.length && this.getOpitons();
    } else if (v) {
      this.getOpitons();
    }
  }

  /**
   * 获取下拉数据
   */
  async getOpitons() {
    const options = this.Config.options as AsyncData<SelectOptions>;
    if (this.options.length && !options.disableCache) return;
    const res = await this.getAsyncData(options);
    if (!res) return;
    this.options = res;
    setTimeout(() => {
      options.afterSend && options.afterSend(options, this);
    }, 0);
  }

  beforeDestroy() {
    if (!_.isArray(this.Config.options)) {
      this.asyncDataLogout(this.Config.options);
    }
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-select) {
  .el-select {
    width: 100%;
  }
}
</style>
